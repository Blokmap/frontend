<script lang="ts" setup>
import Table from '@/components/molecules/table/Table.vue';
import TableCell from '@/components/molecules/table/TableCell.vue';
import { useI18n } from 'vue-i18n';
import { type Role } from '@/domain/member';
import PermissionsBadge from './PermissionsBadge.vue';
import RoleBadge from './RoleBadge.vue';
import type { PermissionType } from '@/domain/auth';

defineProps<{
    roles?: Role[];
    isLoading?: boolean;
    type: PermissionType;
}>();

const { locale } = useI18n();
</script>

<template>
    <Table :value="roles" :loading="isLoading">
        <template #row="{ data: role }">
            <TableCell column="Rol">
                <RoleBadge :role="role" :type="type" />
            </TableCell>

            <TableCell column="Permissies">
                <PermissionsBadge :role="role" :type="type" />
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
