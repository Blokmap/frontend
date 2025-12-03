<script lang="ts" setup>
import Callout from '@/components/shared/molecules/Callout.vue';
import { computed } from 'vue';
import { useReadProfile } from '@/composables/data/useProfile';
import ManagementLoader from '../ManagementLoader.vue';
import ManagementLoaderError from '../ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    profileId?: string;
}>();

const profileId = computed<string>(() => {
    return props.profileId ?? props.authProfile.id;
});

const isOtherProfile = computed(() => {
    return (
        props.authProfile.isAdmin && !!props.profileId && props.profileId !== props.authProfile.id
    );
});

const {
    data: targetProfile,
    isLoading,
    error,
} = useReadProfile(profileId, {
    enabled: isOtherProfile,
});

const profile = computed<Profile>(() => {
    return targetProfile.value ?? props.authProfile;
});
</script>

<template>
    <div class="w-full space-y-6">
        <ManagementLoader v-if="isLoading" />
        <RouterView
            v-else-if="profile"
            v-slot="{ Component }"
            :profile="profile"
            :is-other-profile="isOtherProfile">
            <Callout v-if="isOtherProfile && targetProfile" severity="info" class="mb-6">
                Je bekijkt het beheer van
                <strong>{{ targetProfile.firstName }} {{ targetProfile.lastName }} </strong>.
                <RouterLink
                    :to="{ name: 'manage.dashboard', params: { profileId: authProfile.id } }"
                    class="underline hover:no-underline">
                    Terug naar eigen beheer
                </RouterLink>
            </Callout>
            <component :is="Component" />
        </RouterView>
        <ManagementLoaderError v-else :error="error" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
