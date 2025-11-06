<script setup lang="ts">
import AuthorityMembershipTable from '@/components/features/authority/AuthorityMembershipTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useReadProfileAuthorityMemberships } from '@/composables/data/useMembers';
import type { AuthorityMembership } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    isOwnProfile: boolean;
}>();

const router = useRouter();

const { data: memberships, isLoading } = useReadProfileAuthorityMemberships(
    computed(() => props.profile.id),
);

/**
 * Handle clicking on an authority to view its details.
 * @param membership - The membership that was clicked.
 */
function onMembershipClick(membership: AuthorityMembership): void {
    router.push({
        name: 'dashboard.authorities.detail.overview',
        params: { authorityId: membership.authority.id },
    });
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
            <template #actions>
                <PageHeaderButton label="Autoriteit Aanmaken" severity="contrast">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </DashboardDetailHeader>

        <!-- Authorities Table -->
        <AuthorityMembershipTable
            :memberships="memberships"
            :loading="isLoading"
            empty-message="Dit profiel is niet gekoppeld aan autoriteiten."
            @click:membership="onMembershipClick">
        </AuthorityMembershipTable>
    </DashboardContent>
</template>
