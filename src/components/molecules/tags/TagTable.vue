<script lang="ts" setup>
import Table from '@/components/molecules/table/Table.vue';
import TableCell from '@/components/molecules/table/TableCell.vue';
import { useI18n } from 'vue-i18n';
import TagComponent from './Tag.vue';
import type { Tag } from '@/domain/tag';

defineProps<{
    tags: Tag[] | undefined;
    loading?: boolean;
}>();

const emit = defineEmits<{
    'click:row': [location: Tag];
}>();

const { locale } = useI18n();

const onRowClick = (tag: Tag): void => {
    emit('click:row', tag);
};
</script>

<template>
    <Table :value="tags" :loading="loading" @click:row="onRowClick">
        <template #row="{ data: tag }">
            <TableCell column="Tag">
                <TagComponent :tag="tag" />
            </TableCell>
            <TableCell column="Gemaakt Op">
                {{
                    tag.createdAt.toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })
                }}
            </TableCell>
            <TableCell column="Aangepast Op">
                {{
                    tag.updatedAt.toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })
                }}
            </TableCell>
            <TableCell column="Acties">
                <slot name="actions" :tag="tag"></slot>
            </TableCell>
        </template>
    </Table>
</template>
