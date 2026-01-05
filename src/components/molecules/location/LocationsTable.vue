<script lang="ts" setup>
import Table from '@/components/molecules/table/Table.vue';
import TableCell from '@/components/molecules/table/TableCell.vue';
import ProfileTableCell from '../profile/table/ProfileTableCell.vue';
import LocationStateBadge from './details/LocationStateBadge.vue';
import LocationTableCell from './table/LocationTableCell.vue';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

defineProps<{
    locations?: Location[];
    loading?: boolean;
}>();

const emit = defineEmits<{
    'click:location': [Location];
    'click:profile': [Profile];
}>();

const onRowClick = (location: Location): void => {
    emit('click:location', location);
};

const onProfileClick = (profile: Profile): void => {
    emit('click:profile', profile);
};
</script>

<template>
    <Table :value="locations" :loading="loading" @click:row="onRowClick">
        <template #row="{ data: location }">
            <TableCell column="Naam">
                <LocationTableCell :location="location" />
            </TableCell>
            <TableCell column="Ingediend Door">
                <template v-if="location.createdBy">
                    <ProfileTableCell :profile="location.createdBy" @click.stop="onProfileClick" />
                </template>
                <template v-else>
                    <span class="text-slate-500">-</span>
                </template>
            </TableCell>
            <TableCell column="Status">
                <LocationStateBadge :state="location.state" :location="location" />
            </TableCell>
            <TableCell column="Acties">
                <slot name="actions" :location="location"> </slot>
            </TableCell>
        </template>
    </Table>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
