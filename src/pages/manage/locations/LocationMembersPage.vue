<script lang="ts" setup>
import Badge from 'primevue/badge';
import MembersTable from '@/components/features/member/MembersTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useReadLocationMembers, useReadLocationRoles } from '@/composables/data/useMembers';
import type { Location } from '@/domain/location';
import type { Member } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location?: Location;
    isLoading: boolean;
    error?: Error | null;
}>();

const locationId = computed(() => props.location?.id ?? 0);
const enabled = computed(() => !!props.location?.id);

const { data: membersData, isLoading: membersLoading } = useReadLocationMembers(
    locationId,
    {},
    { enabled },
);

const { data: roles } = useReadLocationRoles(locationId, { enabled });

const members = computed(() => membersData.value?.data ?? []);

const breadcrumbs = computed(() => [
    { label: 'Mijn locaties', to: { name: 'manage.locations' } },
    { label: props.location?.name ?? 'Locatie', to: { name: 'manage.location.info' } },
    { label: 'Leden' },
]);

const isDataLoading = computed(() => props.isLoading || membersLoading.value);

function getRoleName(member: Member): string | undefined {
    if (!roles.value) return undefined;
    const role = roles.value.find((r) => r.id === member.role?.id);
    return role?.name;
}
</script>

<template>
    <div class="space-y-6">
        <ManageBreadcrumb :items="breadcrumbs" />
        <LayoutTitle title="Leden" />

        <p class="text-slate-600">Beheer wie toegang heeft tot deze locatie en hun rollen.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van de leden. Probeer het later opnieuw.
        </Callout>

        <!-- Empty State -->
        <EmptyState
            v-else-if="!isDataLoading && members.length === 0"
            :icon="faUsers"
            title="Geen leden"
            message="Er zijn nog geen leden toegevoegd aan deze locatie.">
        </EmptyState>

        <!-- Data / Loading State -->
        <MembersTable v-else :members="members" :is-loading="isDataLoading">
            <template #role="{ member }">
                <Badge v-if="getRoleName(member)" :value="getRoleName(member)" severity="info" />
                <span v-else class="text-sm text-slate-400">-</span>
            </template>
        </MembersTable>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
