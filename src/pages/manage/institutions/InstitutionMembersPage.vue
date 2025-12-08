<script lang="ts" setup>
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import MemberAddDialog from '@/components/features/member/MemberAddDialog.vue';
import MembersTable from '@/components/features/member/MembersTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import ManagementLoaderError from '@/layouts/manage/ManagementLoaderError.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useAddInstitutionMember,
    useDeleteInstitutionMember,
    useReadInstitutionMembers,
    useReadInstitutionRoles,
    useUpdateInstitutionMember,
} from '@/composables/data/useMembers';
import type { Institution } from '@/domain/institution';
import type { CreateMemberBody } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const { locale } = useI18n();

const institutionId = computed<number>(() => props.institution.id);

const showMemberAddDialog = ref<boolean>(false);

const {
    data: members,
    isLoading: membersLoading,
    error: membersError,
} = useReadInstitutionMembers(institutionId);

const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
} = useReadInstitutionRoles(institutionId, {
    enabled: showMemberAddDialog,
});

const { mutate: addInstitutionMember, isPending: addMemberIsPending } = useAddInstitutionMember({
    onSuccess: () => {
        showMemberAddDialog.value = false;
    },
});

const { mutate: updateInstitutionMember } = useUpdateInstitutionMember();
const { mutate: deleteInstitutionMember } = useDeleteInstitutionMember();

const isLoading = computed(() => membersLoading.value || rolesLoading.value);
const isError = computed(() => !!membersError.value || !!rolesError.value);

const institutionName = computed(() => {
    const name = props.institution?.name;
    if (!name) return 'Instelling';
    return name[locale.value] ?? name.nl ?? 'Instelling';
});

const breadcrumbs = computed(() => [
    { label: 'Instellingen', to: { name: 'manage' } },
    {
        label: institutionName.value,
        to: { name: 'manage.institution.info' },
    },
    { label: 'Leden' },
]);

function onSelectRole(memberId: string, roleId: number): void {
    const member = members.value?.data.find((m) => m.profile.id === memberId);

    if (!member || member?.role?.id === roleId) {
        return;
    }

    updateInstitutionMember({
        id: props.institution.id,
        memberId,
        body: { roleId },
    });
}

function onDeleteClick(memberId: string): void {
    deleteInstitutionMember({
        id: props.institution.id,
        memberId,
    });
}

function onAddMember(body: CreateMemberBody): void {
    addInstitutionMember({
        id: props.institution.id,
        body,
    });
}
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <LayoutTitle title="Instellingsbeheerders">
            <template #actions>
                <PageHeaderButton
                    severity="primary"
                    label="Lid toevoegen"
                    @click="showMemberAddDialog = true">
                    <FontAwesomeIcon :icon="faUserPlus" />
                </PageHeaderButton>
            </template>
        </LayoutTitle>

        <p class="text-slate-600">Beheer wie toegang heeft tot deze instelling en hun rollen.</p>

        <!-- Error State -->
        <ManagementLoaderError v-if="isError" :errors="[membersError, rolesError]" />

        <!-- Data / Loading State -->
        <MembersTable :members="members?.data" :is-loading="isLoading">
            <template #role="{ member }">
                <RoleBadge :role="member.role" type="institution" />
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
