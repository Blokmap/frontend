<script setup lang="ts">
import RoleActionsMenu from '@/components/features/auth/RoleActionsMenu.vue';
import RoleBuilderDialog from '@/components/features/auth/forms/RoleBuilderDialog.vue';
import RoleTable from '@/components/features/auth/roles/RoleTable.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/manage/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import {
    useCreateInstitutionRole,
    useDeleteInstitutionRole,
    useReadInstitutionRoles,
    useUpdateInstitutionRole,
} from '@/composables/data/useMembers';
import type { Institution } from '@/domain/institution';
import type { CreateRoleBody, Role } from '@/domain/member';

const props = defineProps<{
    institutionId: string;
    institution: Institution;
}>();

const { data: roles, isLoading } = useReadInstitutionRoles(computed(() => +props.institutionId));

const showRoleBuilderDialog = ref(false);
const selectedRole = ref<Role | undefined>(undefined);

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

const builderIsPending = computed(() => createIsPending.value || updateIsPending.value);

/**
 * Handle adding a new role.
 */
function onAddRole(): void {
    selectedRole.value = undefined;
    showRoleBuilderDialog.value = true;
}

/**
 * Handle editing a role.
 */
function onEditRole(role: Role): void {
    selectedRole.value = role;
    showRoleBuilderDialog.value = true;
}

/**
 * Handle deleting a role.
 */
function onDeleteRole(role: Role): void {
    deleteRole({
        id: +props.institutionId,
        roleId: role.id,
    });
}

/**
 * Handle form submission from RoleBuilderDialog.
 */
function onSubmitRole(form: CreateRoleBody): void {
    if (selectedRole.value) {
        // Update existing role
        updateRole({
            id: +props.institutionId,
            roleId: selectedRole.value.id,
            body: form,
        });
    } else {
        // Create new role
        createRole({
            id: +props.institutionId,
            body: form,
        });
    }
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader title="Rollen beheren" secondary="Beheer rollen en hun permissies.">
            <template #actions>
                <PageHeaderButton severity="primary" label="Rol toevoegen" @click="onAddRole">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </DashboardDetailHeader>

        <!-- Roles Table -->
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
                v-model:is-visible="showRoleBuilderDialog"
                :role="selectedRole"
                type="institution"
                :is-pending="builderIsPending"
                @click:submit="onSubmitRole">
            </RoleBuilderDialog>
        </Teleport>
    </DashboardContent>
</template>
