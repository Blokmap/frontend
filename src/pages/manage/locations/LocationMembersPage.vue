<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import AccessCard from '@/components/features/member/AccessCard.vue';
import AccessCardLink from '@/components/features/member/AccessCardLink.vue';
import MemberAddDialog from '@/components/features/member/MemberAddDialog.vue';
import MembersTable from '@/components/features/member/MembersTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import PageContent from '@/layouts/PageContent.vue';
import PageTitle from '@/layouts/PageTitle.vue';
import ManagementLoaderError from '@/layouts/manage/ManagementLoaderError.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import { faCity, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useAddLocationMember,
    useDeleteLocationMember,
    useReadLocationMembers,
    useReadLocationRoles,
    useUpdateLocationMember,
} from '@/composables/data/useMembers';
import { usePagination } from '@/composables/usePagination';
import {
    AuthorityPermission,
    has,
    InstitutionPermission,
    type RecursivePermissions,
} from '@/domain/auth';
import type { Location } from '@/domain/location';
import type { CreateMemberBody, MemberFilter } from '@/domain/member';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
    permissions: RecursivePermissions;
}>();

const locationId = computed<number>(() => props.location.id);

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
} = useReadLocationMembers(locationId, filters);

const {
    data: roles,
    isLoading: rolesLoading,
    error: rolesError,
} = useReadLocationRoles(locationId, {
    enabled: showMemberAddDialog,
});

const { mutate: addLocationMember, isPending: addMemberIsPending } = useAddLocationMember({
    onSuccess: () => {
        showMemberAddDialog.value = false;
    },
});

const { mutate: updateLocationMember } = useUpdateLocationMember();
const { mutate: deleteLocationMember } = useDeleteLocationMember();

const isLoading = computed(() => membersLoading.value || rolesLoading.value);
const isError = computed(() => !!membersError.value || !!rolesError.value);

const showInstitutionAccess = computed(() => {
    if (!props.location.institution) return false;
    const hasPermission = has(InstitutionPermission.ManageMembers)(props.permissions.institution);
    return hasPermission || props.authProfile.isAdmin;
});

const showAuthorityAccess = computed(() => {
    if (!props.location.authority) return false;
    const hasPermission = has(AuthorityPermission.ManageMembers)(props.permissions.authority);
    return hasPermission || props.authProfile.isAdmin;
});

const showAccessCard = computed(() => showInstitutionAccess.value || showAuthorityAccess.value);

const breadcrumbs = computed(() => [
    { label: 'Mijn locaties', to: { name: 'manage.locations' } },
    { label: props.location?.name ?? 'Locatie', to: { name: 'manage.location.info' } },
    { label: 'Beheerders' },
]);

function onSelectRole(memberId: string, roleId: number): void {
    const member = members.value?.data.find((m) => m.profile.id === memberId);

    if (!member || member?.role?.id === roleId) {
        return;
    }

    updateLocationMember({
        id: props.location.id,
        memberId,
        body: { roleId },
    });
}

function onDeleteClick(memberId: string): void {
    deleteLocationMember({
        id: props.location.id,
        memberId,
    });
}

function onAddMember(body: CreateMemberBody): void {
    addLocationMember({
        id: props.location.id,
        body,
    });
}
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Locatiebeheerders">
            <template #actions>
                <PageHeaderButton
                    severity="primary"
                    label="Lid toevoegen"
                    @click="showMemberAddDialog = true">
                    <FontAwesomeIcon :icon="faUserPlus" />
                </PageHeaderButton>
            </template>
        </PageTitle>

        <p class="text-slate-600">Beheer wie toegang heeft tot deze locatie en hun rollen.</p>

        <AccessCard v-if="showAccessCard">
            <template #header>
                <h3 class="mb-1 text-sm font-semibold text-slate-700">Toegang via hierarchie</h3>
                <p class="text-xs text-slate-600">
                    Bekijk beheerders met toegang via de organisatie- en groepshierarchie
                </p>
            </template>

            <AccessCardLink
                v-if="showInstitutionAccess && location.institution"
                :to="{
                    name: 'manage.institution.members',
                    params: { institutionId: location.institution.id },
                }"
                label="Organisatie"
                :name="location.institution.name[locale]"
                :logo="location.institution.logo?.url"
                :icon="faCity">
            </AccessCardLink>

            <AccessCardLink
                v-if="showAuthorityAccess && location.authority"
                :to="{
                    name: 'manage.authority.members',
                    params: { authorityId: location.authority.id },
                }"
                label="Groep"
                :name="location.authority.name"
                :logo="location.authority.logo?.url"
                :icon="faCity" />
        </AccessCard>

        <!-- Error State -->
        <ManagementLoaderError v-if="isError" :errors="[membersError]" />

        <!-- Data / Loading State -->
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
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
