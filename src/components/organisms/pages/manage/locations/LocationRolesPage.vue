<script lang="ts" setup>
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import RoleBuilderDialog from '@/components/molecules/auth/forms/RoleBuilderDialog.vue';
import RoleActionsMenu from '@/components/molecules/member/roles/RoleActionsMenu.vue';
import RoleTable from '@/components/molecules/member/roles/RoleTable.vue';
import LoaderError from '@/components/organisms/layouts/LoaderError.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageHeaderButton from '@/components/organisms/pages/PageHeaderButton.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import {
    useCreateLocationRole,
    useDeleteLocationRole,
    useReadLocationRoles,
    useUpdateLocationRole,
} from '@/composables/data/useMembers';
import { type CreateRoleRequest, type Role } from '@/domain/member';
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

function onSubmitRole(form: CreateRoleRequest): void {
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
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Rollen en rechten">
            <template #actions>
                <PageHeaderButton severity="primary" label="Rol toevoegen" @click="onAddRole">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </PageTitle>

        <p class="text-slate-600">Beheer de rollen die gebruikers toegang geven tot de locatie.</p>

        <!-- Error State -->
        <LoaderError v-if="isError" :errors="[rolesError]" />

        <!-- Data / Loading State -->
        <RoleTable :roles="roles" :is-loading="isLoading" type="location">
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
                type="location"
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
