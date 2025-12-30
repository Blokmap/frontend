<script lang="ts" setup>
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

withDefaults(
    defineProps<{
        icon?: IconDefinition;
        title?: string;
        message?: string;
    }>(),
    {
        icon: () => faInbox,
    },
);
</script>

<template>
    <div class="empty-state">
        <div class="empty-state__content">
            <FontAwesomeIcon :icon="icon" class="empty-state__icon" />
            <slot name="title" v-if="$slots.title || title">
                <h3 class="empty-state__title">{{ title }}</h3>
            </slot>
            <slot name="message" v-if="$slots.message || message">
                <p class="empty-state__message">{{ message }}</p>
            </slot>
            <div class="empty-state__actions" v-if="$slots.actions">
                <slot name="actions"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.empty-state {
    @apply rounded-lg border border-slate-200 bg-white px-6 py-12 text-center;

    .empty-state__content {
        @apply mx-auto flex max-w-md flex-col items-center gap-3;
    }

    .empty-state__icon {
        @apply text-5xl text-slate-800;
    }

    .empty-state__title {
        @apply text-2xl font-semibold text-slate-900;
    }

    .empty-state__message {
        @apply text-slate-600;
    }

    .empty-state__actions {
        @apply mt-2;
    }
}
</style>
