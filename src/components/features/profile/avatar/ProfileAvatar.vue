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
    <div class="avatar-wrapper">
        <!-- Edit overlay -->
        <div v-if="editable" class="avatar-overlay" @click="$emit('click:edit')">
            <FontAwesomeIcon class="overlay-icon" :icon="faPencil" />
        </div>

        <!-- Placeholder avatar -->
        <Avatar
            v-if="!profile?.avatarUrl && !image"
            class="avatar-placeholder"
            shape="circle"
            size="xlarge">
            <FontAwesomeIcon class="placeholder-icon" :icon="faUser" />
        </Avatar>

        <!-- Profile image -->
        <img v-else :src="image || profile?.avatarUrl?.url" alt="Profile Avatar" loading="lazy" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.avatar-wrapper {
    @apply relative flex aspect-square items-center justify-center;

    .avatar-placeholder {
        @apply h-full w-full bg-slate-200;

        .placeholder-icon {
            @apply text-slate-500;
            width: clamp(1rem, 25%, 4rem);
            height: clamp(1rem, 25%, 4rem);
            font-size: clamp(1rem, 25%, 4rem);
        }
    }

    .avatar-overlay {
        @apply absolute inset-0 z-10 flex items-center justify-center rounded-full;
        @apply cursor-pointer bg-black/50 opacity-0 transition-opacity duration-300;

        .overlay-icon {
            @apply text-white;
            width: clamp(1rem, 25%, 4rem);
            height: clamp(1rem, 25%, 4rem);
        }
    }

    img {
        @apply absolute inset-0 aspect-square h-full w-full rounded-full object-cover;
    }

    &:hover .avatar-overlay {
        @apply opacity-100;
    }
}
</style>
