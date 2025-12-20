<script lang="ts" setup>
import InstitutionTableCell from '@/components/features/institution/table/InstitutionTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { useI18n } from 'vue-i18n';
import { type Institution } from '@/domain/institution';

defineProps<{
    institutions?: Institution[];
    loading?: boolean;
}>();

const emit = defineEmits<{
    'click:institution': [institution: Institution];
}>();

const { locale } = useI18n();

const onInstitutionClick = (institution: Institution) => {
    emit('click:institution', institution);
};
</script>

<template>
    <Table :value="institutions" @click:row="onInstitutionClick">
        <template #row="{ data: institution }">
            <TableCell column="Institutie">
                <InstitutionTableCell :institution="institution" />
            </TableCell>

            <TableCell column="E-mailadres">
                {{ institution.email || '-' }}
            </TableCell>

            <TableCell column="Telefoon">
                {{ institution.phone || '-' }}
            </TableCell>

            <TableCell column="Adres">
                <div v-if="institution.city || institution.province" class="text-sm">
                    <div v-if="institution.street">{{ institution.street }}</div>
                    <div>
                        <span v-if="institution.zip">{{ institution.zip }}</span>
                        <span v-if="institution.city">
                            {{ institution.zip ? ' ' : '' }}{{ institution.city }}
                        </span>
                    </div>
                    <div v-if="institution.province" class="text-slate-500">
                        {{ institution.province }}
                    </div>
                </div>
                <span v-else>-</span>
            </TableCell>

            <TableCell column="Acties" v-if="$slots.actions">
                <slot name="actions" :institution="institution"></slot>
            </TableCell>
        </template>
    </Table>
</template>
