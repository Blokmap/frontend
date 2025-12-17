<script lang="ts" setup>
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { faCity } from '@fortawesome/free-solid-svg-icons';
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
                    <EntityAvatar
                        class="h-14 w-14 flex-shrink-0"
                        :image="institution.logo?.url"
                        :icon="faCity"
                        :circle="false">
                    </EntityAvatar>
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
