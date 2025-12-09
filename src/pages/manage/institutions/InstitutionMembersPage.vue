<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import MemberAddDialog from '@/components/features/member/MemberAddDialog.vue';
import MembersTable from '@/components/features/member/MembersTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
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
import { usePagination } from '@/composables/usePagination';
import type { Institution } from '@/domain/institution';
import type { CreateMemberBody, MemberFilter } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const institutionId = computed<number>(() => props.institution.id);

const showMemberAddDialog = ref<boolean>(false);

const filters = ref<MemberFilter>({
    page: 1,
    perPage: 25,
});

const { locale } = useI18n();

const { onPageChange, first } = usePagination(filters);

const {
    data: members,
    isLoading: membersLoading,
    error: membersError,
} = useReadInstitutionMembers(institutionId, filters);

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
    { label: 'Beheerders' },
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

        <!-- Error State -->
        <ManagementLoaderError v-if="isError" :errors="[membersError]" />

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
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
