<script setup lang="ts">
import type { Profile } from '@/types/schema/Profile';
import { getProfileInitials } from '@/utils/schema/profile';
import Avatar from 'primevue/avatar';

withDefaults(
    defineProps<{
        profile: Profile;
        size?: string;
    }>(),
    {
        size: '96px',
    },
);
</script>

<template>
    <Avatar
        :label="getProfileInitials(profile)"
        :style="{ width: `${size}`, height: `${size}` }"
        class="profile-avatar"
        shape="circle"
        v-if="!profile.avatarUrl">
    </Avatar>
    <img
        alt="Profile Avatar"
        class="avatar-image"
        loading="lazy"
        :style="{ width: `${size}`, height: `${size}` }"
        :src="profile.avatarUrl"
        v-else />
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.avatar-image {
    @apply rounded-full;
}
</style>
