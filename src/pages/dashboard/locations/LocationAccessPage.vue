<script setup lang="ts">
import Paginator from 'primevue/paginator';
import MemberActionsMenu from '@/components/features/auth/MemberActionsMenu.vue';
import RoleLabel from '@/components/features/auth/roles/RoleLabel.vue';
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faUserPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReadLocationMembers, useReadLocationRoles } from '@/composables/data/useAuth';
import { usePagination } from '@/composables/data/usePagination';
import type { Location } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const { locale } = useI18n();

const filters = ref({
    page: 1,
    perPage: 25,
});

const { data: members, isLoading } = useReadLocationMembers(computed(() => props.location.id));
const { data: roles } = useReadLocationRoles(computed(() => props.location.id));
const { onPageChange, first } = usePagination(filters);

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
                        name: 'dashboard.locations.detail.roles',
                        params: { locationId: location.id },
                    }">
                    <PageHeaderButton severity="contrast" label="Rollen Beheren">
                        <FontAwesomeIcon :icon="faUsers" />
                    </PageHeaderButton>
                </RouterLink>
                <PageHeaderButton severity="contrast" label="Beheerder Toevoegen">
                    <FontAwesomeIcon :icon="faUserPlus" />
                </PageHeaderButton>
            </template>
        </DashboardDetailHeader>

        <!-- Members Table -->
        <Table :value="members?.data" :loading="isLoading">
            <template #row="{ data: member }">
                <TableCell column="Profiel">
                    <ProfileTableCell :profile="member.profile" />
                </TableCell>

                <TableCell column="Rol">
                    <RoleLabel :role="member.role" type="location" />
                </TableCell>

                <TableCell column="Toegevoegd op">
                    {{
                        member.role.createdAt.toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })
                    }}
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

        <Paginator
            v-if="members?.data?.length"
            :first="first"
            :rows="members.perPage"
            :total-records="members.total"
            @page="onPageChange">
        </Paginator>
    </DashboardContent>
</template>
