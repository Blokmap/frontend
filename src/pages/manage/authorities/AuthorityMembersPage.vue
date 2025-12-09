<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import AccessCard from '@/components/features/member/AccessCard.vue';
import AccessCardLink from '@/components/features/member/AccessCardLink.vue';
import MemberAddDialog from '@/components/features/member/MemberAddDialog.vue';
import MembersTable from '@/components/features/member/MembersTable.vue';
import Breadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import ManagementLoaderError from '@/layouts/manage/ManagementLoaderError.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import { faCity, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useAddAuthorityMember,
    useDeleteAuthorityMember,
    useReadAuthorityMembers,
    useReadAuthorityRoles,
    useUpdateAuthorityMember,
} from '@/composables/data/useMembers';
import { usePagination } from '@/composables/usePagination';
import { has, InstitutionPermission, type RecursivePermissions } from '@/domain/auth';
import type { Authority } from '@/domain/authority';
import type { CreateMemberBody, MemberFilter } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
    permissions: RecursivePermissions;
}>();

const { locale } = useI18n();

const authorityId = computed<number>(() => props.authority.id);

const showMemberAddDialog = ref<boolean>(false);

const filters = ref<MemberFilter>({
    page: 1,
    perPage: 10,
});

const { first, onPageChange } = usePagination(filters);

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

const showInstitutionAccess = computed(() => {
    const hasPermission = has(InstitutionPermission.ManageMembers)(props.permissions.institution);
    return hasPermission || props.authProfile.isAdmin;
});

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
    <PageContent>
        <Breadcrumb :items="breadcrumbs" />

        <PageTitle title="Groepsbeheerders">
            <template #actions>
                <PageHeaderButton
                    severity="primary"
                    label="Lid toevoegen"
                    @click="showMemberAddDialog = true">
                    <FontAwesomeIcon :icon="faUserPlus" />
                </PageHeaderButton>
            </template>
        </PageTitle>

        <p class="text-slate-600">Beheer wie toegang heeft tot deze groep en hun rollen.</p>

        <AccessCard v-if="showInstitutionAccess">
            <template #header>
                <h3 class="mb-1 text-sm font-semibold text-slate-700">Toegang via hierarchie</h3>
                <p class="text-xs text-slate-600">
                    Bekijk beheerders met toegang via de bovenliggende organisatie
                </p>
            </template>

            <AccessCardLink
                v-if="authority.institution"
                :to="{
                    name: 'manage.institution.members',
                    params: { institutionId: authority.institution.id },
                }"
                label="Organisatie"
                :name="authority.institution.name[locale]"
                :logo="authority.institution.logo?.url"
                :icon="faCity">
            </AccessCardLink>
        </AccessCard>

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

        <Paginator
            :first="first(members)"
            :rows="members?.perPage"
            :total-records="members?.total"
            @page="onPageChange">
        </Paginator>

        <Teleport to="body">
            <MemberAddDialog
                v-if="roles"
                v-model:is-visible="showMemberAddDialog"
                :roles="roles"
                :is-pending="addMemberIsPending"
                @click:submit="onAddMember">
            </MemberAddDialog>
        </Teleport>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
