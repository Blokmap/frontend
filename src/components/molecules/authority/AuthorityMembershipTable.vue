<script lang="ts" setup>
import AuthorityActionMenu from '@/components/molecules/authority/AuthorityActionMenu.vue';
import Table from '@/components/molecules/table/Table.vue';
import TableCell from '@/components/molecules/table/TableCell.vue';
import RoleBadge from '../member/roles/RoleBadge.vue';
import type { AuthorityMembership } from '@/domain/member';

const props = defineProps<{
    memberships?: AuthorityMembership[];
    loading?: boolean;
    emptyMessage?: string;
    emptyTitle?: string;
}>();

const emit = defineEmits<{
    'click:membership': [membership: AuthorityMembership];
}>();

const onMembershipClick = (membership: AuthorityMembership) => {
    emit('click:membership', membership);
};
</script>

<template>
    <Table
        :value="props.memberships"
        :loading="props.loading"
        :empty-message="props.emptyMessage"
        :empty-title="props.emptyTitle"
        @click:row="onMembershipClick">
        <template #row="{ data: membership }">
            <TableCell column="Autoriteit">
                {{ membership.authority.name }}
            </TableCell>

            <TableCell column="Rol">
                <RoleBadge :role="membership.role" type="authority" />
            </TableCell>

            <TableCell column="Acties">
                <slot name="actions" :authority="membership.authority">
                    <AuthorityActionMenu :authority="membership.authority" />
                </slot>
            </TableCell>
        </template>
    </Table>
</template>
