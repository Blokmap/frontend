<script lang="ts" setup>
import ProfileActionsMenu from '@/components/features/profile/ProfileActionsMenu.vue';
import ProfileStateBadge from '@/components/features/profile/ProfileStateBadge.vue';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import TableHead from '@/components/shared/molecules/table/TableHead.vue';
import type { Profile, ProfileState } from '@/domain/profile';

const props = defineProps<{
    profiles?: Profile[];
    loading?: boolean;
    isProfilePending?: (profileId: number) => boolean;
}>();

const emit = defineEmits<{
    'click:profile': [profile: Profile];
    'change:status': [profileId: number, status: ProfileState];
}>();

const onProfileClick = (profile: Profile) => {
    emit('click:profile', profile);
};

const onStatusChange = (profileId: number, status: ProfileState) => {
    emit('change:status', profileId, status);
};
</script>

<template>
    <Table :value="props.profiles" @click:row="onProfileClick">
        <template #header>
            <tr>
                <TableHead>Profiel</TableHead>
                <TableHead>E-mailadres</TableHead>
                <TableHead>Institutie</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acties</TableHead>
            </tr>
        </template>

        <template #row="{ data: profile }">
            <TableCell>
                <div class="flex items-center space-x-3">
                    <div class="h-12 w-12 flex-shrink-0">
                        <ProfileAvatar :profile="profile" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-medium text-slate-900">
                            {{ profile.firstName }} {{ profile.lastName }}
                        </div>
                        <div class="truncate text-xs text-slate-500">@{{ profile.username }}</div>
                    </div>
                </div>
            </TableCell>

            <TableCell>
                {{ profile.email }}
            </TableCell>

            <TableCell>
                {{ profile.institution?.name || '-' }}
            </TableCell>

            <TableCell>
                <ProfileStateBadge :profile="profile" />
            </TableCell>

            <TableCell>
                <ProfileActionsMenu
                    :profile="profile"
                    :is-pending="props.isProfilePending?.(profile.id)"
                    @change:status="onStatusChange" />
            </TableCell>
        </template>
    </Table>
</template>
