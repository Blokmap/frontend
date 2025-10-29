<script setup lang="ts">
import RoleActionsMenu from '@/components/features/auth/RoleActionsMenu.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadLocationRoles } from '@/composables/data/useAuth';
import type { Role } from '@/domain/auth';
import type { Location } from '@/domain/location';

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
        <DashboardPageHeader title="Rollen beheren" subtitle="Beheer rollen en hun permissies.">
            <template #actions>
                <PageHeaderButton severity="primary" label="Rol toevoegen" @click="onAddRole">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </DashboardPageHeader>

        <!-- Roles Table -->
        <Table :value="roles" :loading="isLoading">
            <template #row="{ data: role }">
                <TableCell column="Rol">
                    <div class="flex items-center gap-2">
                        <span
                            class="inline-block h-3 w-3 rounded-full"
                            :style="{ backgroundColor: role.colour }"></span>
                        <span class="font-medium">{{ role.name }}</span>
                    </div>
                </TableCell>

                <TableCell column="Kleur">
                    <code class="text-xs">{{ role.colour }}</code>
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
