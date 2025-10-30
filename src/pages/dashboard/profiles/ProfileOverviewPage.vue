<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import ProfileActionsMenu from '@/components/features/profile/ProfileActionsMenu.vue';
import ProfileStateBadge from '@/components/features/profile/ProfileStateBadge.vue';
import KeyValue from '@/components/shared/atoms/KeyValue.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUpdateProfileState } from '@/composables/data/useProfile';
import type { Profile, ProfileState } from '@/domain/profile';

defineProps<{
    profile: Profile;
    ownProfile: Profile;
    isOwnProfile: boolean;
}>();

const { locale } = useI18n();

const { mutateAsync: updateProfileState, isPending: isUpdatingState } = useUpdateProfileState({
    onSuccess: () => {
        // Profile state updated successfully
        // Toast is handled in the composable
    },
    onError: (error: any) => {
        // Error toast is handled in the composable
        console.error('Failed to update profile state:', error);
    },
});

const isUpdatingProfile = computed(() => isUpdatingState.value);

/**
 * Change the profile's status
 *
 * @param profileId - ID of the profile
 * @param state - New state for the profile
 */
function onChangeStatus(profileId: string, state: ProfileState) {
    updateProfileState({ profileId, state });
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader title="Profiel">
            <template #secondary>
                <span v-if="isOwnProfile">Details over jouw profiel.</span>
                <span v-else>Details over {{ profile.firstName }}'s profiel.</span>
            </template>
            <template #actions>
                <ProfileActionsMenu
                    :profile="profile"
                    :is-pending="isUpdatingProfile"
                    @change:status="onChangeStatus"
                    v-if="ownProfile.isAdmin">
                    <template #trigger="{ toggle }">
                        <Button
                            severity="contrast"
                            :disabled="isUpdatingProfile"
                            @click="toggle"
                            size="small">
                            <span>Acties</span>
                            <FontAwesomeIcon v-if="isUpdatingProfile" :icon="faSpinner" spin />
                            <FontAwesomeIcon :icon="faChevronDown" v-else />
                        </Button>
                    </template>
                </ProfileActionsMenu>
            </template>
        </DashboardDetailHeader>

        <!-- Profile Information Card -->
        <Card>
            <template #content>
                <div class="grid grid-cols-1 gap-4 py-3 md:grid-cols-2">
                    <!-- Username -->
                    <KeyValue key-label="Gebruikersnaam">
                        <template #value>@{{ profile.username }}</template>
                    </KeyValue>

                    <!-- Email -->
                    <KeyValue key-label="E-mailadres" :value="profile.email" />

                    <!-- Created At -->
                    <KeyValue key-label="Aangemaakt op">
                        <template #value>
                            {{
                                profile.createdAt.toLocaleDateString(locale, {
                                    day: '2-digit',
                                    year: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })
                            }}
                        </template>
                    </KeyValue>

                    <!-- Status -->
                    <KeyValue key-label="Status">
                        <template #value>
                            <ProfileStateBadge :profile="profile" />
                        </template>
                    </KeyValue>
                </div>
            </template>
        </Card>
    </DashboardContent>
</template>
