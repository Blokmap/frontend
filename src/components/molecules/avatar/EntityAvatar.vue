<script setup lang="ts">
import { faPencil, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

withDefaults(
    defineProps<{
        image?: string | null;
        editable?: boolean;
        icon?: IconDefinition;
        circle?: boolean;
    }>(),
    {
        circle: true,
        editable: false,
        icon: () => faUser,
    },
);

defineEmits<{
    'click:edit': [];
}>();
</script>

<template>
    <div class="entity-avatar" :class="{ circle }">
        <!-- Edit overlay -->
        <div
            v-if="editable"
            class="entity-avatar__overlay"
            :class="{ circle }"
            @click="$emit('click:edit')">
            <FontAwesomeIcon class="entity-avatar__edit-icon" :icon="faPencil" />
        </div>

        <!-- Placeholder avatar -->
        <div
            v-if="!image"
            class="entity-avatar__placeholder"
            :class="{ circle }"
            shape="circle"
            size="xlarge">
            <FontAwesomeIcon v-if="icon" class="entity-avatar__placeholder-icon" :icon="icon" />
        </div>

        <!-- Profile image -->
        <img
            v-else
            :src="image"
            alt="Avatar"
            loading="lazy"
            class="entity-avatar__image"
            :class="{ circle }" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.entity-avatar {
    @apply relative flex aspect-auto items-center justify-center rounded-md;

    &.circle {
        @apply rounded-full;
    }
}

.entity-avatar__placeholder {
    @apply flex h-full w-full items-center justify-center rounded-md bg-slate-200;

    &.circle {
        @apply rounded-full;
    }
}

.entity-avatar__placeholder-icon {
    @apply text-slate-700;
    width: clamp(1rem, 25%, 4rem);
    height: clamp(1rem, 25%, 4rem);
    font-size: clamp(1rem, 25%, 4rem);
}

.entity-avatar__overlay {
    @apply absolute inset-0 z-10 flex items-center justify-center;
    @apply cursor-pointer bg-black/50 opacity-0 transition-opacity duration-300;

    &.circle {
        @apply rounded-full;
    }
}

.entity-avatar__edit-icon {
    @apply text-white;
    width: clamp(1rem, 25%, 4rem);
    height: clamp(1rem, 25%, 4rem);
}

.entity-avatar__image {
    @apply absolute aspect-square h-full w-full object-cover;

    &.circle {
        @apply rounded-full;
    }
}

.entity-avatar:hover .entity-avatar__overlay {
    @apply opacity-100;
}
</style>
