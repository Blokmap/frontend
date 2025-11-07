<script lang="ts" setup>
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { faShieldHalved, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import {
    extractPermissions,
    isAdministrator,
    type PermissionType,
    type Role,
} from '@/domain/member';
import RoleBadge from './RoleBadge.vue';
import RolePermissionsPopover from './RolePermissionsPopover.vue';

const props = defineProps<{
    roles?: Role[];
    isLoading?: boolean;
    type: PermissionType;
}>();

const { locale } = useI18n();

/**
 * Get permission labels for a role.
 */
function getRolePermissions(role: Role): Array<[string, number]> {
    return extractPermissions(role.permissions, props.type);
}

/**
 * Check if role has admin permissions.
 */
function isRoleAdmin(role: Role): boolean {
    return isAdministrator(role.permissions);
}
</script>

<template>
    <Table :value="roles" :loading="isLoading">
        <template #row="{ data: role }">
            <TableCell column="Rol">
                <RoleBadge :role="role" :type="type" />
            </TableCell>

            <TableCell column="Permissies">
                <div v-if="isRoleAdmin(role)" class="flex items-center gap-1.5">
                    <FontAwesomeIcon :icon="faShieldHalved" class="text-xs text-gray-500" />
                    <span class="text-sm text-gray-700">
                        {{ $t('permissions.administrator.name') }}
                    </span>
                </div>
                <div
                    v-else-if="getRolePermissions(role).length > 0"
                    class="flex items-center gap-2">
                    <span class="text-sm text-gray-700">
                        {{ $t(`permissions.${type}.${getRolePermissions(role)[0][0]}.name`) }}
                    </span>
                    <button
                        v-if="getRolePermissions(role).length > 1"
                        type="button"
                        class="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 transition-colors hover:bg-gray-200"
                        @click="(e) => ($refs[`popover-${role.id}`] as any)?.toggle(e)">
                        <FontAwesomeIcon :icon="faEllipsis" class="text-[0.625rem]" />
                        <span class="font-medium">+{{ getRolePermissions(role).length - 1 }}</span>
                    </button>

                    <RolePermissionsPopover :ref="`popover-${role.id}`" :role="role" :type="type" />
                </div>
                <p v-else class="text-sm text-slate-400 italic">
                    {{ $t('permissions.none') }}
                </p>
            </TableCell>

            <TableCell column="Aangemaakt op">
                {{
                    new Date(role.createdAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }}
            </TableCell>

            <TableCell column="Laatst bijgewerkt">
                {{
                    new Date(role.updatedAt).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }}
            </TableCell>

            <TableCell column="Acties">
                <slot name="actions" :role="role"></slot>
            </TableCell>
        </template>
    </Table>
</template>
