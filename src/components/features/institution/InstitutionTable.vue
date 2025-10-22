<script lang="ts" setup>
import InstitutionActionsMenu from '@/components/features/institution/InstitutionActionsMenu.vue';
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
                <div class="flex items-center space-x-3">
                    <div class="h-12 w-12 flex-shrink-0">
                        <!-- <img
                            :src="institution.logo.url"
                            :alt="institution.name[locale] || 'Institution logo'"
                            class="h-12 w-12 rounded-lg object-contain" /> -->
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-medium text-slate-900">
                            {{ institution.name[locale] }}
                        </div>
                        <div class="truncate text-xs text-slate-500">
                            {{ institution.slug }}
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell column="E-mailadres">
                {{ institution.email || '-' }}
            </TableCell>

            <TableCell column="Telefoon">
                {{ institution.phone || '-' }}
            </TableCell>

            <TableCell column="Locatie">
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

            <TableCell column="Acties">
                <InstitutionActionsMenu :institution="institution" />
            </TableCell>
        </template>
    </Table>
</template>
