<script setup lang="ts">
import RoleActionsMenu from '@/components/features/auth/RoleActionsMenu.vue';
import RoleBadge from '@/components/features/auth/roles/RoleBadge.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadLocationRoles } from '@/composables/data/useAuth';
import type { Location } from '@/domain/location';
import type { Role } from '@/domain/member';

const props = defineProps<{
    locationId: string;
    location: Location;
}>();

const { data: roles, isLoading } = useReadLocationRoles(computed(() => +props.locationId));

/**
 * Handle adding a new role.
 */
function onAddRole(): void {
    // TODO: Implement add role dialog
    console.log('Add new role');
}

/**
 * Handle editing a role.
 */
function onEditRole(role: Role): void {
    // TODO: Implement role edit
    console.log('Edit role', role);
}

/**
 * Handle deleting a role.
 */
function onDeleteRole(role: Role): void {
    // TODO: Implement role deletion
    console.log('Delete role', role);
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
        <Table :value="roles" :loading="isLoading">
            <template #row="{ data: role }">
                <TableCell column="Rol">
                    <RoleBadge :role="role" type="location" />
                </TableCell>

                <TableCell column="Permissies">
                    {{ role.permissions }}
                </TableCell>

                <TableCell column="Aangemaakt op">
                    {{ new Date(role.createdAt).toLocaleDateString('nl-NL') }}
                </TableCell>

                <TableCell column="Laatst bijgewerkt">
                    {{ new Date(role.updatedAt).toLocaleDateString('nl-NL') }}
                </TableCell>

                <TableCell column="Acties">
                    <RoleActionsMenu :role="role" @edit="onEditRole" @delete="onDeleteRole" />
                </TableCell>
            </template>
        </Table>
    </DashboardContent>
</template>
