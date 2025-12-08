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
import {
    useCreateLocationRole,
    useDeleteLocationRole,
    useReadLocationRoles,
    useUpdateLocationRole,
} from '@/composables/data/useMembers';
import { type CreateRoleBody, type Role } from '@/domain/member';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
}>();

const locationId = computed<number>(() => props.location.id);

const {
    data: roles,
    isLoading,
    isError: rolesIsError,
    error: rolesError,
} = useReadLocationRoles(locationId);

const { mutate: createRole, isPending: createIsPending } = useCreateLocationRole({
    onSuccess: () => {
        showRoleBuilderDialog.value = false;
        selectedRole.value = undefined;
    },
});

const { mutate: updateRole, isPending: updateIsPending } = useUpdateLocationRole({
    onSuccess: () => {
        showRoleBuilderDialog.value = false;
        selectedRole.value = undefined;
    },
});

const { mutate: deleteRole, isPending: deleteIsPending } = useDeleteLocationRole();

const showRoleBuilderDialog = ref<boolean>(false);
const selectedRole = ref<Role | undefined>(undefined);

const isError = computed<boolean>(() => {
    return rolesIsError.value;
});

const isPending = computed(() => {
    return createIsPending.value || updateIsPending.value || deleteIsPending.value;
});

const breadcrumbs = computed(() => [
    { label: 'Mijn locaties', to: { name: 'manage.locations' } },
    { label: props.location?.name ?? 'Locatie', to: { name: 'manage.location.info' } },
    { label: 'Beheerders' },
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
        id: locationId.value,
        roleId: role.id,
    });
}

function onSubmitRole(form: CreateRoleBody): void {
    if (selectedRole.value) {
        // Update existing role
        updateRole({
            id: locationId.value,
            roleId: selectedRole.value.id,
            body: form,
        });
    } else {
        // Create new role
        createRole({
            id: props.location.id,
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

        <p class="text-slate-600">Beheer de rollen die gebruikers toegang geven tot de locatie.</p>

        <!-- Error State -->
        <ManagementLoaderError v-if="isError" :errors="[rolesError]" />

        <!-- Data / Loading State -->
        <RoleTable :roles="roles" :is-loading="isLoading" type="location">
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
                type="location"
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
