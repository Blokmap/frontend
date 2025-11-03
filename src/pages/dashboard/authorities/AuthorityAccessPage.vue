<script setup lang="ts">
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadAuthorityMembers, useReadAuthorityRoles } from '@/composables/data/useAuth';
import type { Authority } from '@/domain/authority';

const props = defineProps<{
    authorityId: string;
    authority: Authority;
}>();

const { data: members, isLoading } = useReadAuthorityMembers(computed(() => +props.authorityId));
const { data: roles } = useReadAuthorityRoles(computed(() => +props.authorityId));

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
        <DashboardDetailHeader title="Toegangsbeheer" secondary="Beheer leden en hun rollen.">
            <template #actions>
                <RouterLink
                    :to="{
                        name: 'dashboard.authorities.detail.roles',
                        params: { authorityId },
                    }">
                    <PageHeaderButton severity="contrast" label="Rollen beheren">
                        <FontAwesomeIcon :icon="faCircleUser" />
                    </PageHeaderButton>
                </RouterLink>
            </template>
        </DashboardDetailHeader>

        <!-- Members Table -->
        <Table :value="members?.data" :loading="isLoading">
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
                    <MemberActionMenu
                        :member="member"
                        :available-roles="roles || []"
                        @change:role="onChangeRole(member.profile.id, $event)"
                        @click:delete="onRemoveMember(member.profile.id)">
                    </MemberActionMenu>
                </TableCell>
            </template>
        </Table>
    </DashboardContent>
</template>
