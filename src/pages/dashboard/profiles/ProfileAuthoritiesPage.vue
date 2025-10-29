<script setup lang="ts">
import AuthorityTable from '@/components/features/authority/AuthorityTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useReadProfileAuthorities } from '@/composables/data/useAuthorities';
import type { Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    isOwnProfile: boolean;
}>();

const router = useRouter();

const { data: authorities, isLoading } = useReadProfileAuthorities(
    computed(() => props.profile.id),
);

/**
 * Handle clicking on an authority to view its details.
 * @param authority The authority that was clicked.
 */
function onAuthorityClick(authority: Authority): void {
    router.push({ name: 'dashboard.authorities.detail', params: { authorityId: authority.id } });
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader title="Autoriteiten">
            <template #secondary>
                <span v-if="isOwnProfile">
                    Bekijk en beheer autoriteiten gekoppeld aan jouw profiel.
                </span>
                <span v-else>
                    Bekijk en beheer autoriteiten gekoppeld aan {{ profile.firstName }}'s profiel.
                </span>
            </template>
        </DashboardDetailHeader>

        <!-- Authorities Table -->
        <AuthorityTable
            :authorities="authorities"
            :loading="isLoading"
            empty-message="Dit profiel is niet gekoppeld aan autoriteiten."
            @click:authority="onAuthorityClick">
        </AuthorityTable>
    </DashboardContent>
</template>
