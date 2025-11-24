<script setup lang="ts">
import Paginator from 'primevue/paginator';
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import MemberAddDialog from '@/components/features/member/MemberAddDialog.vue';
import MembersTable from '@/components/features/member/MembersTable.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/manage/details/DashboardDetailHeader.vue';
import { faUserPlus, faUserTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import {
    useReadAuthorityRoles,
    useAddAuthorityMember,
    useDeleteAuthorityMember,
    useReadAuthorityMembers,
    useUpdateAuthorityMember,
} from '@/composables/data/useMembers';
import { usePagination } from '@/composables/usePagination';
import type { Authority } from '@/domain/authority';
import type { CreateMemberBody } from '@/domain/member';

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

const { mutate: addAuthorityMember, isPending: addMemberIsPending } = useAddAuthorityMember({
    onSuccess: () => {
        showMemberAddDialog.value = false;
    },
});
const { mutate: updateAuthorityMember } = useUpdateAuthorityMember();
const { mutate: deleteAuthorityMember } = useDeleteAuthorityMember();

const showMemberAddDialog = ref(false);

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

/**
 * Handle adding a new member.
 *
 * @param body - The body containing the username and role ID
 */
function onAddMember(body: CreateMemberBody): void {
    addAuthorityMember({
        id: props.authority.id,
        body,
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
                <PageHeaderButton
                    severity="contrast"
                    label="Beheerder Toevoegen"
                    @click="showMemberAddDialog = true">
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

        <Teleport to="body">
            <MemberAddDialog
                v-if="roles"
                :is-pending="addMemberIsPending"
                :roles="roles"
                @click:submit="onAddMember"
                v-model:is-visible="showMemberAddDialog">
            </MemberAddDialog>
        </Teleport>
    </DashboardContent>
</template>
