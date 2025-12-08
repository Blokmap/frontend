<script lang="ts" setup>
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import MemberAddDialog from '@/components/features/member/MemberAddDialog.vue';
import MembersTable from '@/components/features/member/MembersTable.vue';
import Breadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import ManagementLoaderError from '@/layouts/manage/ManagementLoaderError.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import {
    useAddAuthorityMember,
    useDeleteAuthorityMember,
    useReadAuthorityMembers,
    useReadAuthorityRoles,
    useUpdateAuthorityMember,
} from '@/composables/data/useMembers';
import type { Authority } from '@/domain/authority';
import type { CreateMemberBody } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const authorityId = computed<number>(() => props.authority.id);

const showMemberAddDialog = ref<boolean>(false);

const {
    data: members,
    isLoading: membersLoading,
    error: membersError,
} = useReadAuthorityMembers(authorityId);

const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
} = useReadAuthorityRoles(authorityId, {
    enabled: showMemberAddDialog,
});

const { mutate: addAuthorityMember, isPending: addMemberIsPending } = useAddAuthorityMember({
    onSuccess: () => {
        showMemberAddDialog.value = false;
    },
});

const { mutate: updateAuthorityMember } = useUpdateAuthorityMember();
const { mutate: deleteAuthorityMember } = useDeleteAuthorityMember();

const isLoading = computed(() => membersLoading.value || rolesLoading.value);
const isError = computed(() => !!membersError.value || !!rolesError.value);

const breadcrumbs = computed(() => [
    { label: 'Groepen', to: { name: 'manage' } },
    {
        label: props.authority?.name ?? 'Groep',
        to: { name: 'manage.authority.info' },
    },
    { label: 'Leden' },
]);

function onSelectRole(memberId: string, roleId: number): void {
    const member = members.value?.data.find((m) => m.profile.id === memberId);

    if (!member || member?.role?.id === roleId) {
        return;
    }

    updateAuthorityMember({
        id: props.authority.id,
        memberId,
        body: { roleId },
    });
}

function onDeleteClick(memberId: string): void {
    deleteAuthorityMember({
        id: props.authority.id,
        memberId,
    });
}

function onAddMember(body: CreateMemberBody): void {
    addAuthorityMember({
        id: props.authority.id,
        body,
    });
}
</script>

<template>
    <LayoutContent>
        <Breadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Groepsbeheerders">
            <template #actions>
                <PageHeaderButton
                    severity="primary"
                    label="Lid toevoegen"
                    @click="showMemberAddDialog = true">
                    <FontAwesomeIcon :icon="faUserPlus" />
                </PageHeaderButton>
            </template>
        </LayoutTitle>

        <p class="text-slate-600">Beheer wie toegang heeft tot deze groep en hun rollen.</p>

        <!-- Error State -->
        <ManagementLoaderError v-if="isError" :errors="[membersError, rolesError]" />

        <!-- Data / Loading State -->
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

        <Teleport to="body">
            <MemberAddDialog
                v-if="roles"
                v-model:is-visible="showMemberAddDialog"
                :roles="roles"
                :is-pending="addMemberIsPending"
                @click:submit="onAddMember">
            </MemberAddDialog>
        </Teleport>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
