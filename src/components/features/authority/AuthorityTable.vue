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
        :is-loading="props.loading"
        :empty-message="props.emptyMessage"
        :empty-title="props.emptyTitle"
        @click:row="onAuthorityClick">
        <template #row="{ data: authority }">
            <TableCell column="Autoriteit">
                <div class="flex items-center space-x-3">
                    <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-medium text-slate-900">
                            {{ authority.name }}
                        </div>
                        <div class="truncate text-xs text-slate-500">ID: {{ authority.id }}</div>
                    </div>
                </div>
            </TableCell>

            <TableCell column="Beschrijving">
                {{ authority.description || '-' }}
            </TableCell>

            <TableCell column="Leden">
                {{ authority.members?.length || 0 }}
            </TableCell>

            <TableCell column="Locaties">
                {{ authority.locations?.length || 0 }}
            </TableCell>

            <TableCell column="Acties">
                <slot name="actions" :authority="authority">
                    <!-- Default action menu -->
                    <AuthorityActionsMenu :authority="authority" />
                </slot>
            </TableCell>
        </template>
    </Table>
</template>
