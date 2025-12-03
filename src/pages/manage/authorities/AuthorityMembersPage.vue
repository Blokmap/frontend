<script lang="ts" setup>
import Badge from 'primevue/badge';
import MembersTable from '@/components/features/member/MembersTable.vue';
import Breadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useReadAuthorityMembers, useReadAuthorityRoles } from '@/composables/data/useMembers';
import type { Authority } from '@/domain/authority';
import type { Member } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority?: Authority;
    isLoading: boolean;
    error?: Error | null;
}>();

const authorityId = computed(() => props.authority?.id ?? 0);
const enabled = computed(() => !!props.authority?.id);

const { data: membersData, isLoading: membersLoading } = useReadAuthorityMembers(authorityId, {
    enabled,
});

const { data: roles } = useReadAuthorityRoles(authorityId, { enabled });

const members = computed(() => membersData.value?.data ?? []);

const breadcrumbs = computed(() => [
    {
        label: props.authority?.name ?? 'Groep',
        to: { name: 'manage.authority.overview' },
    },
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
    <LayoutContent>
        <Breadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Leden" />

        <p class="text-slate-600">Beheer leden en hun rollen binnen deze groep.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van de leden. Probeer het later opnieuw.
        </Callout>

        <!-- Empty State -->
        <EmptyState
            v-else-if="!isDataLoading && members.length === 0"
            :icon="faUsers"
            title="Geen leden"
            message="Er zijn nog geen leden toegevoegd aan deze groep.">
        </EmptyState>

        <!-- Data / Loading State -->
        <MembersTable v-else :members="members" :is-loading="isDataLoading">
            <template #role="{ member }">
                <Badge v-if="getRoleName(member)" :value="getRoleName(member)" severity="info" />
                <span v-else class="text-sm text-slate-400">-</span>
            </template>
        </MembersTable>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
