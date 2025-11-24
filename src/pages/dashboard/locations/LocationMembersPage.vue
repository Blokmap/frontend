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
    useReadLocationRoles,
    useAddLocationMember,
    useDeleteLocationMember,
    useReadLocationMembers,
    useUpdateLocationMember,
} from '@/composables/data/useMembers';
import { usePagination } from '@/composables/usePagination';
import { type Location } from '@/domain/location';
import type { CreateMemberBody, MemberFilter } from '@/domain/member';

const props = defineProps<{
    location: Location;
}>();

const filters = ref<MemberFilter>({
    page: 1,
    perPage: 25,
});

const { onPageChange, first } = usePagination(filters);

const { data: members, isLoading } = useReadLocationMembers(
    computed(() => props.location.id),
    filters,
);

const { data: roles } = useReadLocationRoles(computed(() => props.location.id));

const { mutate: addLocationMember, isPending: addMemberIsPending } = useAddLocationMember({
    onSuccess: () => {
        showMemberAddDialog.value = false;
    },
});

const { mutate: updateLocationMember } = useUpdateLocationMember();
const { mutate: deleteLocationMember } = useDeleteLocationMember();

const showMemberAddDialog = ref(false);

/**
 * Handle changing a member's role.
 * @param memberId - The ID of the member
 * @param roleID - The new role's ID
 */
function onSelectRole(memberId: string, roleId: number): void {
    updateLocationMember({
        id: props.location.id,
        memberId,
        body: { roleId },
    });
}

/**
 * Handle removing a member.
 * @param memberId - The ID of the member to remove
 */
function onDeleteClick(memberId: string): void {
    deleteLocationMember({
        id: props.location.id,
        memberId,
    });
}

/**
 * Handle adding a new member.
 *
 * @param body - The body containing the username and role ID
 */
function onAddMember(body: CreateMemberBody): void {
    addLocationMember({
        id: props.location.id,
        body,
    });
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader title="Toegangsbeheer" secondary="Beheer leden en hun rollen.">
            <template #actions>
                <RouterLink
                    :to="{
                        name: 'dashboard.locations.detail.roles',
                        params: { locationId: location.id },
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
                <RoleBadge :role="member.role" type="location" />
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
