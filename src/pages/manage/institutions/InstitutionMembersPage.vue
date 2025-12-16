<script lang="ts" setup>
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import MemberAddDialog from '@/components/features/member/MemberAddDialog.vue';
import MembersTable from '@/components/features/member/MembersTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import ManagementLoaderError from '@/layouts/manage/ManagementLoaderError.vue';
import PageContent from '@/pages/PageContent.vue';
import PageHeaderButton from '@/pages/PageHeaderButton.vue';
import PageTitle from '@/pages/PageTitle.vue';
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
import { getInstitutionName, type Institution } from '@/domain/institution';
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
} = useReadInstitutionRoles(institutionId);

const { mutate: addInstitutionMember, isPending: addMemberIsPending } = useAddInstitutionMember({
    onSuccess: () => {
        showMemberAddDialog.value = false;
    },
});

function onAddMember(body: CreateMemberBody): void {
    addInstitutionMember({
        id: props.institution.id,
        body,
    });
}

const { mutate: updateInstitutionMember } = useUpdateInstitutionMember();

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

const { mutate: deleteInstitutionMember } = useDeleteInstitutionMember();

function onDeleteClick(memberId: string): void {
    deleteInstitutionMember({
        id: props.institution.id,
        memberId,
    });
}

const isLoading = computed(() => {
    return membersLoading.value || rolesLoading.value;
});

const isError = computed(() => {
    return !!membersError.value || !!rolesError.value;
});

const breadcrumbs = computed(() => {
    const institutionName = getInstitutionName(props.institution, locale.value);

    return [
        {
            label: institutionName,
            to: {
                name: 'manage.institution.info',
                params: {
                    institutionId: props.institution.id,
                },
            },
        },
        {
            label: 'Beheerders',
        },
    ];
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <PageTitle title="Beheerders">
            <template #actions>
                <PageHeaderButton
                    severity="primary"
                    label="Lid toevoegen"
                    @click="showMemberAddDialog = true">
                    <FontAwesomeIcon :icon="faUserPlus" />
                </PageHeaderButton>
            </template>
        </PageTitle>

        <p class="text-slate-600">Beheer wie toegang heeft tot deze instelling en hun rollen.</p>

        <ManagementLoaderError v-if="isError" :errors="[membersError, rolesError]" />

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
                :pending="addMemberIsPending"
                @click:submit="onAddMember">
            </MemberAddDialog>
        </Teleport>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
