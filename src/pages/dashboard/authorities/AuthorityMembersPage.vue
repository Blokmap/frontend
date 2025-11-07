<script setup lang="ts">
import Paginator from 'primevue/paginator';
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import MembersTable from '@/components/features/member/MembersTable.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faUserPlus, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useReadAuthorityRoles } from '@/composables/data/useAuth';
import {
    useDeleteAuthorityMember,
    useReadAuthorityMembers,
    useUpdateAuthorityMember,
} from '@/composables/data/useMembers';
import { usePagination } from '@/composables/usePagination';
import type { Authority } from '@/domain/authority';

const props = defineProps<{
    authority: Authority;
}>();

const pagination = ref({
    page: 1,
    perPage: 25,
});

const { onPageChange, first } = usePagination(pagination);
const { data: members, isLoading } = useReadAuthorityMembers(computed(() => props.authority.id));

const { data: roles } = useReadAuthorityRoles(computed(() => props.authority.id));

const { mutate: updateAuthorityMember } = useUpdateAuthorityMember();
const { mutate: deleteAuthorityMember } = useDeleteAuthorityMember();

/**
 * Handle changing a member's role.
 * @param memberId - The ID of the member
 * @param roleID - The new role's ID
 */
function onSelectRole(memberId: string, roleId: number): void {
    updateAuthorityMember({
        id: props.authority.id,
        memberId,
        body: { roleId },
    });
}

/**
 * Handle removing a member.
 * @param memberId - The ID of the member to remove
 */
function onDeleteClick(memberId: string): void {
    deleteAuthorityMember({
        id: props.authority.id,
        memberId,
    });
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader title="Leden" secondary="Beheer leden en hun rollen.">
            <template #actions>
                <RouterLink
                    :to="{
                        name: 'dashboard.authorities.detail.roles',
                        params: { authorityId: authority.id },
                    }">
                    <PageHeaderButton severity="contrast" label="Rollen Beheren">
                        <FontAwesomeIcon :icon="faUserTag" />
                    </PageHeaderButton>
                </RouterLink>
                <PageHeaderButton severity="contrast" label="Beheerder Toevoegen">
                    <FontAwesomeIcon :icon="faUserPlus" />
                </PageHeaderButton>
            </template>
        </DashboardDetailHeader>

        <!-- Members Table -->
        <MembersTable :members="members?.data" :is-loading="isLoading">
            <template #role="{ member }">
                <RoleBadge :role="member.role" type="authority" />
            </template>
            <template #actions="{ member }">
                <MemberActionMenu
                    v-if="roles"
                    :member="member"
                    :available-roles="roles"
                    @select:role="onSelectRole"
                    @click:delete="onDeleteClick">
                </MemberActionMenu>
            </template>
        </MembersTable>

        <Paginator
            :first="first(members)"
            :rows="members?.perPage"
            :total-records="members?.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
