<script lang="ts" setup>
import AuthorityActionsMenu from '@/components/features/authority/AuthorityActionsMenu.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import type { Authority } from '@/domain/authority';

const props = defineProps<{
    authorities?: Authority[];
    loading?: boolean;
    emptyMessage?: string;
    emptyTitle?: string;
}>();

const emit = defineEmits<{
    'click:authority': [authority: Authority];
}>();

const onAuthorityClick = (authority: Authority) => {
    emit('click:authority', authority);
};
</script>

<template>
    <Table
        :value="props.authorities"
        :loading="props.loading"
        :empty-message="props.emptyMessage"
        :empty-title="props.emptyTitle"
        @click:row="onAuthorityClick">
        <template #row="{ data: authority }">
            <TableCell column="Autoriteit">
                {{ authority.name }}
            </TableCell>

            <TableCell column="Beschrijving">
                {{ authority.description || '-' }}
            </TableCell>

            <TableCell column="Acties">
                <slot name="actions" :authority="authority">
                    <AuthorityActionsMenu :authority="authority" />
                </slot>
            </TableCell>
        </template>
    </Table>
</template>
