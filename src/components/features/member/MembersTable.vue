<script lang="ts" setup>
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { useI18n } from 'vue-i18n';
import type { Membership } from '@/domain/member';

defineProps<{
    members?: Membership[];
    isLoading?: boolean;
    isMemberPending?: (memberId: string) => boolean;
}>();

const { locale } = useI18n();
</script>

<template>
    <Table :value="members" :loading="isLoading">
        <template #row="{ data: member }">
            <TableCell column="Profiel">
                <ProfileTableCell :profile="member.profile" />
            </TableCell>

            <TableCell column="Rol" v-if="$slots.role">
                <slot name="role" :member="member"> </slot>
            </TableCell>

            <TableCell column="Toegevoegd Op">
                {{
                    member.role.createdAt.toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                }}
            </TableCell>

            <TableCell column="Acties" v-if="$slots.actions">
                <slot name="actions" :member="member"> </slot>
            </TableCell>
        </template>
    </Table>
</template>
