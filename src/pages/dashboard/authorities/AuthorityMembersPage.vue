<script setup lang="ts">
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import ProfileSelectorDialog from '@/components/features/profile/ProfileSelectorDialog.vue';
import ProfileSelectorTable from '@/components/features/profile/ProfileSelectorTable.vue';
import ProfileStateBadge from '@/components/features/profile/ProfileStateBadge.vue';
import ProfileTableCell from '@/components/features/profile/ProfileTableCell.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
    useAddMemberToAuthority,
    useDeleteMemberFromAuthority,
    useReadAuthorityMembers,
} from '@/composables/data/useMembers';
import { useReadProfiles } from '@/composables/data/useProfile';
import { useToast } from '@/composables/store/useToast';
import type { Authority } from '@/domain/authority';
import type { Profile, ProfileFilter } from '@/domain/profile';

const props = defineProps<{
    authority: Authority;
}>();

const router = useRouter();
const toast = useToast();

const searchFilters = ref<ProfileFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

const { data: members, isLoading } = useReadAuthorityMembers(computed(() => props.authority.id));
const { data: searchResults, isLoading: isSearching } = useReadProfiles(searchFilters);
const { mutateAsync: addMember, isPending: isAdding } = useAddMemberToAuthority();
const { mutateAsync: deleteMember, isPending: isRemoving } = useDeleteMemberFromAuthority();

const showSelectorDialog = ref(false);

/**
 * Handle clicking on a profile to view its details.
 * @param profile The profile that was clicked.
 */
function onProfileClick(profile: Profile): void {
    router.push({
        name: 'dashboard.profiles.detail.overview',
        params: { profileId: profile.id },
    });
}

/**
 * Handle adding a new user to the authority.
 */
function onAddUser(): void {
    showSelectorDialog.value = true;
    searchFilters.value = {
        query: '',
        page: 1,
        perPage: 25,
    };
}

/**
 * Handle pagination page change in the selector dialog.
 */
function onSelectorPageChange(event: { page: number }): void {
    searchFilters.value.page = event.page + 1;
}

/**
 * Handle searching for profiles in the selector dialog.
 */
async function onSearchProfiles(query: string): Promise<void> {
    try {
        searchFilters.value.query = query;
        searchFilters.value.page = 1;
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Zoekfout',
            detail: 'Er is een fout opgetreden bij het zoeken naar profielen.',
        });
    }
}

/**
 * Handle selecting a profile to add to the authority.
 */
async function onSelectProfile(profile: Profile): Promise<void> {
    addMember({
        id: props.authority.id,
        memberId: profile.id,
    });
}

/**
 * Handle removing a user from the authority.
 */
async function onRemoveUser(profile: Profile): Promise<void> {
    deleteMember({
        id: props.authority.id,
        memberId: profile.id,
    });
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader
            title="Leden"
            secondary="Beheer leden die aan deze autoriteit zijn gekoppeld.">
            <template #actions>
                <Button severity="primary" @click="onAddUser">
                    <FontAwesomeIcon :icon="faUserPlus" class="mr-2" />
                    Lid Toevoegen
                </Button>
            </template>
        </DashboardDetailHeader>

        <!-- Profiles Table -->
        <Table
            :value="members?.data"
            :loading="isLoading"
            @click:row="(membership) => onProfileClick(membership.profile)">
            <template #row="{ data: membership }">
                <TableCell column="Profiel">
                    <ProfileTableCell :profile="membership.profile" />
                </TableCell>

                <TableCell column="E-mailadres">
                    {{ membership.profile.email }}
                </TableCell>

                <TableCell column="Status">
                    <ProfileStateBadge :profile="membership.profile" />
                </TableCell>

                <TableCell column="Acties">
                    <Button
                        size="small"
                        severity="danger"
                        :loading="isRemoving"
                        @click.stop="onRemoveUser(membership.profile)"
                        outlined>
                        Verwijderen
                    </Button>
                </TableCell>
            </template>
        </Table>
        <Teleport to="body">
            <!-- Profile Selector Dialog -->
            <ProfileSelectorDialog
                v-model:visible="showSelectorDialog"
                :profiles="searchResults?.data"
                :loading="isSearching"
                @search="onSearchProfiles">
                <template #table="{ profiles: dialogProfiles, onSelect }">
                    <ProfileSelectorTable
                        :profiles="dialogProfiles"
                        :loading="isSearching"
                        @click:profile="onSelect">
                        <template #actions="{ profile }">
                            <Button
                                size="small"
                                severity="primary"
                                outlined
                                :loading="isAdding"
                                @click.stop="onSelectProfile(profile)">
                                <FontAwesomeIcon :icon="faUserPlus" class="mr-1" />
                                Toevoegen
                            </Button>
                        </template>
                    </ProfileSelectorTable>

                    <Paginator
                        v-if="searchResults?.data?.length"
                        :first="searchResults.perPage * (searchResults.page - 1)"
                        :rows="searchResults.perPage"
                        :total-records="searchResults.total"
                        @page="onSelectorPageChange">
                    </Paginator>
                </template>
            </ProfileSelectorDialog>
        </Teleport>
    </DashboardContent>
</template>
