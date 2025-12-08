<script lang="ts" setup>
import RoleActionsMenu from '@/components/features/auth/RoleActionsMenu.vue';
import RoleBuilderDialog from '@/components/features/auth/forms/RoleBuilderDialog.vue';
import RoleTable from '@/components/features/auth/roles/RoleTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import ManagementLoaderError from '@/layouts/manage/ManagementLoaderError.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useCreateInstitutionRole,
    useDeleteInstitutionRole,
    useReadInstitutionRoles,
    useUpdateInstitutionRole,
} from '@/composables/data/useMembers';
import { type CreateRoleBody, type Role } from '@/domain/member';
import type { Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution: Institution;
}>();

const { locale } = useI18n();

const institutionId = computed<number>(() => props.institution.id);

const {
    data: roles,
    isLoading,
    isError: rolesIsError,
    error: rolesError,
} = useReadInstitutionRoles(institutionId);

const { mutate: createRole, isPending: createIsPending } = useCreateInstitutionRole({
    onSuccess: () => {
        showRoleBuilderDialog.value = false;
        selectedRole.value = undefined;
    },
});

const { mutate: updateRole, isPending: updateIsPending } = useUpdateInstitutionRole({
    onSuccess: () => {
        showRoleBuilderDialog.value = false;
        selectedRole.value = undefined;
    },
});

const { mutate: deleteRole, isPending: deleteIsPending } = useDeleteInstitutionRole();

const showRoleBuilderDialog = ref<boolean>(false);
const selectedRole = ref<Role | undefined>(undefined);

const isError = computed<boolean>(() => {
    return rolesIsError.value;
});

const isPending = computed(() => {
    return createIsPending.value || updateIsPending.value || deleteIsPending.value;
});

const institutionName = computed(() => {
    const name = props.institution?.name;
    if (!name) return 'Instelling';
    return name[locale.value] ?? name.nl ?? 'Instelling';
});

const breadcrumbs = computed(() => [
    { label: 'Instellingen', to: { name: 'manage' } },
    { label: institutionName.value, to: { name: 'manage.institution.info' } },
    { label: 'Rollen' },
]);

function onAddRole(): void {
    selectedRole.value = undefined;
    showRoleBuilderDialog.value = true;
}

function onEditRole(role: Role): void {
    selectedRole.value = role;
    showRoleBuilderDialog.value = true;
}

function onDeleteRole(role: Role): void {
    deleteRole({
        id: institutionId.value,
        roleId: role.id,
    });
}

function onSubmitRole(form: CreateRoleBody): void {
    if (selectedRole.value) {
        // Update existing role
        updateRole({
            id: institutionId.value,
            roleId: selectedRole.value.id,
            body: form,
        });
    } else {
        // Create new role
        createRole({
            id: props.institution.id,
            body: form,
        });
    }
}
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <LayoutTitle title="Rollen en rechten">
            <template #actions>
                <PageHeaderButton severity="primary" label="Rol toevoegen" @click="onAddRole">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </LayoutTitle>

        <p class="text-slate-600">
            Beheer de rollen die gebruikers toegang geven tot de instelling.
        </p>

        <!-- Error State -->
        <ManagementLoaderError v-if="isError" :errors="[rolesError]" />

        <!-- Data / Loading State -->
        <RoleTable :roles="roles" :is-loading="isLoading" type="institution">
            <template #actions="{ role }">
                <RoleActionsMenu
                    :role="role"
                    :is-pending="deleteIsPending"
                    @edit="onEditRole"
                    @delete="onDeleteRole">
                </RoleActionsMenu>
            </template>
        </RoleTable>

        <Teleport to="body">
            <RoleBuilderDialog
                type="institution"
                v-model:is-visible="showRoleBuilderDialog"
                :role="selectedRole"
                :is-pending="isPending"
                @click:submit="onSubmitRole">
            </RoleBuilderDialog>
        </Teleport>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
