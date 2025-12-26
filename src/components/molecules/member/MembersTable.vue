<script lang="ts" setup>
import Table from '@/components/molecules/table/Table.vue';
import TableCell from '@/components/molecules/table/TableCell.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ProfileTableCell from '../profile/table/ProfileTableCell.vue';
import type { Member } from '@/domain/member';

defineProps<{
    members?: Member[];
    isLoading?: boolean;
    isMemberPending?: (memberId: string) => boolean;
}>();

const { locale } = useI18n();
const router = useRouter();

/**
 * Handle clicking on a row.
 * @param member - The member object to navigate to
 */
function onRowClick(member: Member): void {
    router.push({
        name: 'manage',
        params: { profileId: member.profile.id },
    });
}
</script>

<template>
    <Table :value="members" :loading="isLoading" @click:row="onRowClick">
        <template #row="{ data: member }">
            <TableCell column="Profiel">
                <ProfileTableCell :profile="member.profile" />
            </TableCell>

            <TableCell column="Rol" v-if="$slots.role">
                <slot name="role" :member="member"> </slot>
            </TableCell>

            <TableCell column="Toegevoegd Op">
                {{
                    member.addedAt.toLocaleDateString(locale, {
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
