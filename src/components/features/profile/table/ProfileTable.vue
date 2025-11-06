<script lang="ts" setup>
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import ProfileStateBadge from '../ProfileStateBadge.vue';
import ProfileTableCell from './ProfileTableCell.vue';
import type { Profile } from '@/domain/profile';

defineProps<{
    profiles: Profile[] | undefined;
    loading: boolean;
}>();

const emit = defineEmits<{
    'click:profile': [profile: Profile];
}>();

/**
 * Handle selecting a profile.
 *
 * @param profile - The selected profile
 */
function onProfileClick(profile: Profile): void {
    emit('click:profile', profile);
}
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

            <TableCell column="Institutie">
                {{ profile.institution?.name || '-' }}
            </TableCell>

            <TableCell column="Status">
                <ProfileStateBadge :profile="profile" />
            </TableCell>

            <TableCell column="Acties" v-if="$slots.actions">
                <slot name="actions" :profile="profile"> </slot>
            </TableCell>
        </template>
    </Table>
</template>
