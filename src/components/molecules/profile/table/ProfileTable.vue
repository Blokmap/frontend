<script lang="ts" setup>
import Table from '@/components/molecules/table/Table.vue';
import TableCell from '@/components/molecules/table/TableCell.vue';
import ProfileStateBadge from '../ProfileStateBadge.vue';
import ProfileTableCell from './ProfileTableCell.vue';
import type { Profile } from '@/domain/profile';

withDefaults(
    defineProps<{
        profiles: Profile[] | undefined;
        loading: boolean;
        showInstitution?: boolean;
    }>(),
    {
        showInstitution: true,
    },
);

const emit = defineEmits<{
    'click:profile': [profile: Profile];
}>();

const onProfileClick = (profile: Profile): void => {
    emit('click:profile', profile);
};
</script>

<template>
    <Table :value="profiles" :loading="loading" @click:row="onProfileClick">
        <template #row="{ data: profile }">
            <TableCell column="Profiel">
                <ProfileTableCell :profile="profile" />
            </TableCell>

            <TableCell column="E-mailadres">
                {{ profile.email }}
            </TableCell>

            <TableCell column="Institutie" v-if="showInstitution">
                {{ profile.institution?.name || '-' }}
            </TableCell>

            <TableCell column="Status">
                <ProfileStateBadge :state="profile.state" />
            </TableCell>

            <TableCell v-if="$slots.actions" column="Acties">
                <slot name="actions" :profile="profile"> </slot>
            </TableCell>
        </template>
    </Table>
</template>
