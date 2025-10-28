<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProfileTable from '@/components/features/profile/ProfileTable.vue';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faTrash, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useReadProfiles } from '@/composables/data/useProfile';
import type { Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    institution: Institution;
}>();

const router = useRouter();

// Fetch profiles for this institution via server-side filter
const { data: profilesData, isLoading } = useReadProfiles(
    computed(() => ({ institution: props.institution.slug })),
);

const profiles = computed(() => profilesData.value?.data || []);

/**
 * Handle clicking on a profile to view its details.
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
    // TODO: Implement add user dialog/modal
    console.log('Add user to institution', props.institution.slug);
}

/**
 * Handle removing a user from the institution.
 */
function onRemoveUser(profile: Profile): void {
    // TODO: Implement remove user functionality
    console.log('Remove user from institution', profile.id);
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
            <Card>
                <template #content>
                    <ProfileTable
                        :profiles="profiles"
                        :loading="isLoading"
                        @click:profile="onProfileClick">
                        <template #actions="{ profile }">
                            <ActionMenu>
                                <template #content="{ hideMenu }">
                                    <button
                                        class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                                        @click="
                                            () => {
                                                onRemoveUser(profile);
                                                hideMenu();
                                            }
                                        ">
                                        <FontAwesomeIcon :icon="faTrash" />
                                        <span>Verwijderen</span>
                                    </button>
                                </template>
                            </ActionMenu>
                        </template>
                    </ProfileTable>
                </template>
            </Card>
        </div>
    </DashboardContent>
</template>
