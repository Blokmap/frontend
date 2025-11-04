<script setup lang="ts">
import Paginator from 'primevue/paginator';
import MemberActionMenu from '@/components/features/auth/MemberActionMenu.vue';
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useReadInstitutionRoles } from '@/composables/data/useAuth';
import { useReadInstitutionMembers } from '@/composables/data/useMembers';
import { usePagination } from '@/composables/data/usePagination';
import type { Institution } from '@/domain/institution';

const props = defineProps<{
    institutionId: string;
    institution: Institution;
}>();

const filters = ref({
    page: 1,
    perPage: 25,
});

const { data: members, isLoading } = useReadInstitutionMembers(
    computed(() => +props.institutionId),
);
const { data: roles } = useReadInstitutionRoles(computed(() => +props.institutionId));
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
                        name: 'dashboard.institutions.detail.roles',
                        params: { institutionId },
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
                        @change:role="onChangeRole"
                        @remove="onRemoveMember">
                    </MemberActionMenu>
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
