<script setup lang="ts">
import MemberActionsMenu from '@/components/features/auth/MemberActionsMenu.vue';
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import { faShield } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadLocationMembers, useReadLocationRoles } from '@/composables/data/useAuth';
import type { Location } from '@/domain/location';

const props = defineProps<{
    locationId: string;
    location: Location;
}>();

const { data: members, isLoading } = useReadLocationMembers(computed(() => +props.locationId));
const { data: roles } = useReadLocationRoles(computed(() => +props.locationId));

/**
 * Handle changing a member's role.
 */
function onChangeRole(profileId: string, roleName: string): void {
    // TODO: Implement role change
    console.log('Change role for', profileId, 'to', roleName);
}

/**
 * Handle removing a member.
 */
function onRemoveMember(profileId: string): void {
    // TODO: Implement member removal
    console.log('Remove member', profileId);
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardPageHeader title="Toegangsbeheer" subtitle="Beheer leden en hun rollen.">
            <template #actions>
                <RouterLink
                    :to="{
                        name: 'dashboard.locations.detail.roles',
                        params: { locationId },
                    }">
                    <PageHeaderButton severity="secondary" label="Rollen beheren">
                        <FontAwesomeIcon :icon="faShield" />
                    </PageHeaderButton>
                </RouterLink>
            </template>
        </DashboardPageHeader>

        <!-- Members Table -->
        <Table :value="members" :loading="isLoading">
            <template #row="{ data: member }">
                <TableCell column="Profiel">
                    <ProfileTableCell :profile="member.profile" />
                </TableCell>

                <TableCell column="Rol">
                    <div class="flex items-center gap-2">
                        <span
                            class="inline-block h-3 w-3 rounded-full"
                            :style="{ backgroundColor: member.role.colour }"></span>
                        <span class="font-medium">{{ member.role.name }}</span>
                    </div>
                </TableCell>

                <TableCell column="Permissies">
                    {{ member.role.permissions }}
                </TableCell>

                <TableCell column="Toegevoegd op">
                    {{ member.role.createdAt.toLocaleDateString('nl-NL') }}
                </TableCell>

                <TableCell column="Acties">
                    <MemberActionsMenu
                        :member="member"
                        :available-roles="roles || []"
                        @change:role="onChangeRole"
                        @remove="onRemoveMember">
                    </MemberActionsMenu>
                </TableCell>
            </template>
        </Table>
    </DashboardContent>
</template>
