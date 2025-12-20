<script lang="ts" setup>
import RoleActionsMenu from '@/components/features/auth/RoleActionsMenu.vue';
import RoleBuilderDialog from '@/components/features/auth/forms/RoleBuilderDialog.vue';
import RoleTable from '@/components/features/auth/roles/RoleTable.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import LoaderError from '@/layouts/LoaderError.vue';
import PageContent from '@/pages/PageContent.vue';
import PageHeaderButton from '@/pages/PageHeaderButton.vue';
import PageTitle from '@/pages/PageTitle.vue';
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
import { getInstitutionName, type Institution } from '@/domain/institution';
import { type CreateRoleBody, type Role } from '@/domain/member';
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

const institutionName = computed<string>(() => {
    return getInstitutionName(props.institution, locale.value);
});

const breadcrumbs = computed(() => {
    return [
        {
            label: institutionName.value,
            to: {
                name: 'manage.institution.info',
            },
        },
        {
            label: 'Rollen',
        },
    ];
});
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Rollen en rechten">
            <template #actions>
                <PageHeaderButton severity="primary" label="Rol toevoegen" @click="onAddRole">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </PageTitle>

        <p class="text-slate-600">
            Beheer de rollen die gebruikers toegang geven tot de instelling.
        </p>

        <!-- Error State -->
        <LoaderError v-if="isError" :errors="[rolesError]" />

        <!-- Data / Loading State -->
        <RoleTable :roles="roles" :is-loading="isLoading" type="institution">
            <template #actions="{ role }">
                <RoleActionsMenu
                    :role="role"
                    :pending="deleteIsPending"
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
                :pending="isPending"
                @click:submit="onSubmitRole">
            </RoleBuilderDialog>
        </Teleport>
    </PageContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
