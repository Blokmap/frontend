<script setup lang="ts">
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import { faBuilding, faCity, faIdCard, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useReadProfile } from '@/composables/data/useProfile';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profileId: string;
    profile: Profile;
}>();

const profileId = computed(() => +props.profileId);
const isOwnProfile = computed(() => profileId.value === props.profile.id);

const {
    data: fetchedProfile,
    isLoading,
    error,
} = useReadProfile(profileId, {
    enabled: computed(() => !isOwnProfile.value),
});

const currentProfile = computed(() => (!isOwnProfile.value ? fetchedProfile.value : props.profile));

const tabs = computed<TabItem[]>(() => [
    {
        value: 'overview',
        label: 'Overzicht',
        icon: faIdCard,
        route: {
            name: 'dashboard.profiles.detail.overview',
            params: { profileId: props.profileId },
        },
    },
    {
        value: 'locations',
        label: 'Locaties',
        icon: faMapLocationDot,
        route: {
            name: 'dashboard.profiles.detail.locations',
            params: { profileId: props.profileId },
        },
    },
    {
        value: 'authorities',
        label: 'Autoriteiten',
        icon: faBuilding,
        route: {
            name: 'dashboard.profiles.detail.authorities',
            params: { profileId: props.profileId },
        },
    },
    {
        value: 'institutions',
        label: 'Instituties',
        icon: faCity,
        route: {
            name: 'dashboard.profiles.detail.institutions',
            params: { profileId: props.profileId },
        },
    },
]);
</script>

<template>
    <DashboardContent>
        <!-- Loading State -->
        <DashboardLoading v-if="isLoading" />

        <!-- Not Found State -->
        <DashboardNotFound
            v-else-if="!currentProfile || error"
            title="Profiel Niet Gevonden"
            message="Het profiel dat je zoekt bestaat niet of je hebt geen toegang.">
        </DashboardNotFound>

        <!-- Content -->
        <template v-else>
            <!-- Profile Header -->
            <Card class="profile-header-card">
                <template #content>
                    <div class="profile-header">
                        <!-- Avatar Section -->
                        <template v-if="isLoading || !currentProfile">
                            <Skeleton shape="circle" size="96px" />
                        </template>
                        <template v-else>
                            <div class="avatar-wrapper">
                                <ProfileAvatar :profile="currentProfile" />
                            </div>
                        </template>

                        <!-- Profile Info -->
                        <div class="profile-info">
                            <template v-if="isLoading">
                                <Skeleton height="36px" width="200px" />
                                <Skeleton height="21px" width="300px" />
                                <Skeleton height="21px" width="250px" />
                            </template>
                            <template v-else-if="currentProfile">
                                <!-- Name -->
                                <div class="profile-info__name">
                                    <h1 class="text-2xl font-bold text-gray-900">
                                        {{ currentProfile.firstName }} {{ currentProfile.lastName }}
                                    </h1>
                                </div>

                                <!-- Email -->
                                <div class="flex items-center gap-2 text-gray-600 md:gap-3">
                                    <span class="text-sm text-gray-700 md:text-base">
                                        {{ currentProfile.email }}
                                    </span>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
            </Card>

            <!-- Tabs -->
            <TabNavigation :tabs="tabs" />

            <!-- Page Content -->
            <div class="tab-content">
                <RouterView
                    :profile="currentProfile"
                    :own-profile="profile"
                    :is-own-profile="isOwnProfile">
                </RouterView>
            </div>
        </template>
    </DashboardContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.profile-header-card {
    @apply mb-6;
}

.profile-header {
    @apply flex flex-row items-center gap-3 md:gap-6;

    .avatar-wrapper {
        @apply h-16 w-16 flex-shrink-0;
        @apply md:h-24 md:w-24;
    }

    .profile-info {
        @apply flex flex-1 flex-col space-y-1;
        @apply md:space-y-3;

        .profile-info__name {
            @apply flex flex-row items-center gap-0.5;
            @apply md:gap-3;

            h1 {
                @apply text-base leading-tight font-bold;
                @apply md:text-2xl md:leading-normal;
            }
        }
    }
}
</style>
