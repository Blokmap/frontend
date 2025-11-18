<script setup lang="ts">
import AuthorityActionMenu from '@/components/features/authority/AuthorityActionMenu.vue';
import AuthorityMembershipTable from '@/components/features/authority/AuthorityMembershipTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDeleteAuthority } from '@/composables/data/useAuthorities';
import { useReadProfileAuthorityMemberships } from '@/composables/data/useMembers';
import type { AuthorityMembership } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    isOwnProfile: boolean;
}>();

const router = useRouter();

const {
    mutateAsync: deleteAuthority,
    isPending: isPendingDelete,
    variables,
} = useDeleteAuthority();

const { data: memberships, isLoading } = useReadProfileAuthorityMemberships(
    computed(() => props.profile.id),
);

function isAuthorityPending(authority: { id: number }): boolean {
    return variables.value === authority.id && isPendingDelete.value;
}

function onMembershipClick(membership: AuthorityMembership): void {
    router.push({
        name: 'dashboard.authorities.detail.overview',
        params: { authorityId: membership.authority.id },
    });
}

function onAuthorityDeleteClick(authorityId: number): void {
    deleteAuthority(authorityId);
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
                <RouterLink :to="{ name: 'dashboard.authorities.create' }">
                    <PageHeaderButton label="Autoriteit Aanmaken" severity="contrast">
                        <FontAwesomeIcon :icon="faPlus" />
                    </PageHeaderButton>
                </RouterLink>
            </template>
        </DashboardDetailHeader>

        <!-- Authorities Table -->
        <AuthorityMembershipTable
            :memberships="memberships"
            :loading="isLoading"
            empty-message="Dit profiel is niet gekoppeld aan autoriteiten."
            @click:membership="onMembershipClick">
            <template #actions="{ authority }">
                <AuthorityActionMenu
                    :authority="authority"
                    :is-pending="isAuthorityPending(authority)"
                    @click:delete="onAuthorityDeleteClick">
                </AuthorityActionMenu>
            </template>
        </AuthorityMembershipTable>
    </DashboardContent>
</template>
