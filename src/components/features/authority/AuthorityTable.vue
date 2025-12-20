<script lang="ts" setup>
import AuthorityTableCell from '@/components/features/authority/table/AuthorityTableCell.vue';
import InstitutionTableCell from '@/components/features/institution/table/InstitutionTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { useI18n } from 'vue-i18n';
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

const { locale } = useI18n();

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
                <AuthorityTableCell :authority="authority" />
            </TableCell>

            <TableCell column="Organisatie">
                <InstitutionTableCell
                    v-if="authority.institution"
                    :institution="authority.institution" />
                <span v-else> - </span>
            </TableCell>

            <TableCell column="Gemaakt op">
                {{
                    authority.createdAt.toLocaleString(locale, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })
                }}
            </TableCell>

            <TableCell column="Acties" v-if="$slots.actions">
                <slot name="actions" :authority="authority"></slot>
            </TableCell>
        </template>
    </Table>
</template>
