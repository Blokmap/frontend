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
    useAddInstitutionMember,
    useListInstitutionMembers,
    useRemoveInstitutionMember,
} from '@/composables/data/useInstitutions';
import { useReadProfiles } from '@/composables/data/useProfile';
import { useToast } from '@/composables/store/useToast';
import type { Institution } from '@/domain/institution';
import type { Profile, ProfileFilter } from '@/domain/profile';

const props = defineProps<{
    institution: Institution;
}>();

const router = useRouter();
const toast = useToast();

// Fetch members for this institution
const {
    data: members,
    isLoading,
    refetch: refetchMembers,
} = useListInstitutionMembers(computed(() => props.institution.id));

const showSelectorDialog = ref(false);

// Search filters with pagination for the profile selector dialog
const searchFilters = ref<ProfileFilter>({
    query: '',
    page: 1,
    perPage: 25,
});

// Fetch profiles for the selector dialog
const { data: searchResults, isLoading: isSearching } = useReadProfiles(searchFilters);

// Add member mutation
const { mutateAsync: addMember, isPending: isAdding } = useAddInstitutionMember();

// Remove member mutation
const { mutateAsync: removeMember, isPending: isRemoving } = useRemoveInstitutionMember();

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
 * Handle adding a new user to the institution.
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
 * Handle selecting a profile to add to the institution.
 */
async function onSelectProfile(profile: Profile): Promise<void> {
    try {
        await addMember({
            id: props.institution.id,
            profileId: profile.id,
        });
        toast.add({
            severity: 'success',
            summary: 'Lid toegevoegd',
            detail: 'Het lid is succesvol toegevoegd aan de institutie.',
        });
        await refetchMembers();
        showSelectorDialog.value = false;
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij toevoegen',
            detail: 'Er is een fout opgetreden bij het toevoegen van het lid.',
        });
    }
}

/**
 * Handle removing a user from the institution.
 */
async function onRemoveUser(profile: Profile): Promise<void> {
    try {
        await removeMember({
            id: props.institution.id,
            profileId: profile.id,
        });
        toast.add({
            severity: 'success',
            summary: 'Lid verwijderd',
            detail: 'Het lid is succesvol verwijderd uit de institutie.',
        });
        await refetchMembers();
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij verwijderen',
            detail: 'Er is een fout opgetreden bij het verwijderen van het lid.',
        });
    }
}
</script>

<template>
    <DashboardContent>
        <div class="space-y-6">
            <!-- Header -->
            <DashboardDetailHeader
                title="Gebruikers"
                secondary="Beheer gebruikers die aan deze institutie zijn gekoppeld.">
                <template #actions>
                    <Button severity="primary" @click="onAddUser">
                        <FontAwesomeIcon :icon="faUserPlus" class="mr-2" />
                        Gebruiker Toevoegen
                    </Button>
                </template>
            </DashboardDetailHeader>

            <!-- Profiles Table -->
            <Table :value="members" :loading="isLoading" @click:row="onProfileClick">
                <template #row="{ data: profile }">
                    <TableCell column="Profiel">
                        <ProfileTableCell :profile="profile" />
                    </TableCell>

                    <TableCell column="E-mailadres">
                        {{ profile.email }}
                    </TableCell>

                    <TableCell column="Status">
                        <ProfileStateBadge :profile="profile" />
                    </TableCell>

                    <TableCell column="Acties">
                        <Button
                            size="small"
                            severity="danger"
                            :loading="isRemoving"
                            @click.stop="onRemoveUser(profile)"
                            outlined>
                            Verwijderen
                        </Button>
                    </TableCell>
                </template>
            </Table>
        </div>

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
    </DashboardContent>
</template>
