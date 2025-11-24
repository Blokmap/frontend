<script setup lang="ts">
import ProfileHeader from '@/components/features/profile/ProfileHeader.vue';
import ProfileAvatarDialog from '@/components/features/profile/avatar/ProfileAvatarDialog.vue';
import TabNavigation, { type TabItem } from '@/components/shared/molecules/TabNavigation.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import DashboardLoading from '@/layouts/manage/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/manage/DashboardNotFound.vue';
import { faBuilding, faCity, faIdCard, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { computed, ref } from 'vue';
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

const showAvatarDialog = ref<boolean>(false);

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

function onAvatarEditClick(): void {
    showAvatarDialog.value = true;
}
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
            <ProfileHeader
                :profile="currentProfile"
                :loading="isLoading"
                :editable="isOwnProfile"
                @click:edit="onAvatarEditClick">
            </ProfileHeader>

            <!-- Tabs -->
            <TabNavigation :tabs="tabs" />

            <!-- Page Content -->
            <div class="tab-content">
                <RouterView
                    v-slot="{ Component }"
                    :profile="currentProfile"
                    :own-profile="profile"
                    :is-own-profile="isOwnProfile">
                    <Transition name="fade" mode="out-in">
                        <component :is="Component" />
                    </Transition>
                </RouterView>
            </div>
        </template>
        <Teleport to="body">
            <ProfileAvatarDialog :profile="profile" :visible="showAvatarDialog" />
        </Teleport>
    </DashboardContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
