<script setup lang="ts">
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faBuilding, faCity, faIdCard, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { useReadProfile } from '@/composables/data/useProfile';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profileId: string;
    profile: Profile;
}>();

const isOwnProfile = computed(() => props.profileId === props.profile.id);

const {
    data: fetchedProfile,
    isLoading,
    error,
} = useReadProfile(
    computed(() => props.profileId),
    {
        enabled: computed(() => !isOwnProfile.value),
    },
);

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
            <DashboardDetailHeader
                :loading="isLoading"
                :show-skeletons="true"
                avatar-shape="circle"
                :title="`${currentProfile?.firstName} ${currentProfile?.lastName}`"
                :primary="currentProfile?.email">
                <template #avatar>
                    <ProfileAvatar :profile="currentProfile!" />
                </template>
            </DashboardDetailHeader>

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
</style>
