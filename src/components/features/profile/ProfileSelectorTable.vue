<script lang="ts" setup>
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import type { Profile } from '@/domain/profile';

defineProps<{
    profiles?: Profile[];
    loading?: boolean;
}>();

const emit = defineEmits<{
    'click:profile': [profile: Profile];
}>();

const onProfileClick = (profile: Profile) => {
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

            <TableCell column="Institutie">
                {{ profile.institution?.name || '-' }}
            </TableCell>

            <!-- No Status column for selector -->

            <TableCell column="Acties">
                <slot name="actions" :profile="profile">
                    <!-- Default slot for custom actions -->
                </slot>
            </TableCell>
        </template>
    </Table>
</template>
