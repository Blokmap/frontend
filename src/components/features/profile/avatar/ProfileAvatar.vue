<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { faPencil, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { Profile } from '@/domain/profile';

withDefaults(
    defineProps<{
        profile?: Profile;
        image?: string;
        editable?: boolean;
    }>(),
    {
        editable: false,
    },
);

defineEmits<{ (e: 'click:edit'): void }>();
</script>

<template>
    <div class="profile-avatar">
        <!-- Edit overlay -->
        <div v-if="editable" class="profile-avatar__overlay" @click="$emit('click:edit')">
            <FontAwesomeIcon class="profile-avatar__edit-icon" :icon="faPencil" />
        </div>

        <!-- Placeholder avatar -->
        <Avatar
            v-if="!profile?.avatarUrl && !image"
            class="profile-avatar__placeholder"
            shape="circle"
            size="xlarge">
            <FontAwesomeIcon class="profile-avatar__placeholder-icon" :icon="faUser" />
        </Avatar>

        <!-- Profile image -->
        <img
            v-else
            :src="image || profile?.avatarUrl?.url"
            alt="Profile Avatar"
            loading="lazy"
            class="profile-avatar__image" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.profile-avatar {
    @apply relative flex aspect-square items-center justify-center;
}

.profile-avatar__placeholder {
    @apply h-full w-full bg-slate-200;
}

.profile-avatar__placeholder-icon {
    @apply text-slate-700;
    width: clamp(1rem, 25%, 4rem);
    height: clamp(1rem, 25%, 4rem);
    font-size: clamp(1rem, 25%, 4rem);
}

.profile-avatar__overlay {
    @apply absolute inset-0 z-10 flex items-center justify-center rounded-full;
    @apply cursor-pointer bg-black/50 opacity-0 transition-opacity duration-300;
}

.profile-avatar__edit-icon {
    @apply text-white;
    width: clamp(1rem, 25%, 4rem);
    height: clamp(1rem, 25%, 4rem);
}

.profile-avatar__image {
    @apply shadow-playful absolute aspect-square h-full w-full rounded-full object-cover;
    --shadow-color: var(--color-slate-200);
}

.profile-avatar:hover .profile-avatar__overlay {
    @apply opacity-100;
}
</style>
