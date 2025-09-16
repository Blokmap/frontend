<script setup lang="ts">
import Avatar from 'primevue/avatar';
import { faPencil, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { Profile } from '@/domain/profile';

withDefaults(
    defineProps<{
        profile: Profile;
        image?: string;
        editable?: boolean;
        avatarClass?: string;
    }>(),
    {
        editable: false,
    },
);

defineEmits<{
    (e: 'click:edit'): void;
}>();
</script>

<template>
    <div class="avatar-wrapper">
        <div v-if="editable" class="avatar-overlay" @click="$emit('click:edit')">
            <FontAwesomeIcon class="icon text-white" :icon="faPencil" />
        </div>
        <Avatar
            v-if="!profile.avatarUrl && !image"
            class="avatar-initials aspect-square h-full w-full"
            :class="avatarClass"
            shape="circle">
            <FontAwesomeIcon class="icon text-surface" :icon="faUser" />
        </Avatar>
        <img
            v-else
            alt="Profile Avatar"
            class="aspect-square h-full w-full rounded-full object-cover"
            :class="avatarClass"
            loading="lazy"
            :src="image || profile.avatarUrl?.url" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.avatar-wrapper {
    @apply relative flex items-center justify-center;

    .avatar-overlay {
        @apply flex items-center justify-center opacity-0;
        @apply absolute inset-0 rounded-full transition-all duration-300;
    }

    .icon {
        width: clamp(1rem, 25%, 4rem);
        height: clamp(1rem, 25%, 4rem);
        font-size: clamp(1rem, 25%, 4rem);
    }

    &:hover .avatar-overlay {
        @apply cursor-pointer bg-black/50 opacity-100;
    }
}
</style>
