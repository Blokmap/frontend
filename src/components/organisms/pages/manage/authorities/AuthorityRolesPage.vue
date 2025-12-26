<script lang="ts" setup>
import ManageBreadcrumb from '@/components/molecules/Breadcrumb.vue';
import RoleActionsMenu from '@/components/molecules/auth/RoleActionsMenu.vue';
import RoleBuilderDialog from '@/components/molecules/auth/forms/RoleBuilderDialog.vue';
import RoleTable from '@/components/molecules/auth/roles/RoleTable.vue';
import LoaderError from '@/components/organisms/layouts/LoaderError.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageHeaderButton from '@/components/organisms/pages/PageHeaderButton.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    useCreateAuthorityRole,
    useDeleteAuthorityRole,
    useReadAuthorityRoles,
    useUpdateAuthorityRole,
} from '@/composables/data/useMembers';
import { getInstitutionName } from '@/domain/institution';
import { type CreateRoleBody, type Role } from '@/domain/member';
import type { Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority: Authority;
}>();

const { locale } = useI18n();

const authorityId = computed<number>(() => props.authority.id);

const {
    data: roles,
    isLoading,
    isError: rolesIsError,
    error: rolesError,
} = useReadAuthorityRoles(authorityId);

const { mutate: createRole, isPending: createIsPending } = useCreateAuthorityRole({
    onSuccess: () => {
        showRoleBuilderDialog.value = false;
        selectedRole.value = undefined;
    },
});

const { mutate: updateRole, isPending: updateIsPending } = useUpdateAuthorityRole({
    onSuccess: () => {
        showRoleBuilderDialog.value = false;
        selectedRole.value = undefined;
    },
});

function onSubmitRole(form: CreateRoleBody): void {
    if (selectedRole.value) {
        // Update existing role
        updateRole({
            id: authorityId.value,
            roleId: selectedRole.value.id,
            body: form,
        });
    } else {
        // Create new role
        createRole({
            id: props.authority.id,
            body: form,
        });
    }
}

const { mutate: deleteRole, isPending: deleteIsPending } = useDeleteAuthorityRole();

function onDeleteRole(role: Role): void {
    deleteRole({
        id: authorityId.value,
        roleId: role.id,
    });
}

const showRoleBuilderDialog = ref<boolean>(false);
const selectedRole = ref<Role | undefined>(undefined);

const isError = computed<boolean>(() => {
    return rolesIsError.value;
});

const isPending = computed(() => {
    return createIsPending.value || updateIsPending.value || deleteIsPending.value;
});

const breadcrumbs = computed(() => {
    const institutionId = props.authority.institution?.id;
    const institutionName = getInstitutionName(props.authority.institution, locale.value);

    return [
        {
            label: institutionName,
            to: {
                name: 'manage.institution.info',
                params: {
                    institutionId,
                },
            },
        },
        {
            label: props.authority?.name ?? 'Groep',
            to: {
                name: 'manage.authority.info',
            },
        },
        {
            label: 'Rollen',
        },
    ];
});

function onAddRole(): void {
    selectedRole.value = undefined;
    showRoleBuilderDialog.value = true;
}

function onEditRole(role: Role): void {
    selectedRole.value = role;
    showRoleBuilderDialog.value = true;
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

        <p class="text-slate-600">Beheer de rollen die gebruikers toegang geven tot de groep.</p>

        <!-- Error State -->
        <LoaderError v-if="isError" :errors="[rolesError]" />

        <!-- Data / Loading State -->
        <RoleTable :roles="roles" :is-loading="isLoading" type="authority">
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
                type="authority"
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
