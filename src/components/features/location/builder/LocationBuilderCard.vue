<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

defineProps<{
    icon: IconDefinition;
}>();
</script>

<template>
    <div class="builder-card">
        <div class="builder-card__body">
            <div class="builder-card__header">
                <div v-if="icon" class="builder-card__icon">
                    <FontAwesomeIcon :icon="icon" />
                </div>
                <div class="builder-card__title">
                    <slot name="header"></slot>
                </div>
            </div>
            <slot name="default"></slot>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.builder-card {
    @apply rounded-lg bg-white p-3 shadow-md sm:p-4;

    .builder-card__body {
        @apply space-y-4 sm:space-y-6;
    }

    .builder-card__header {
        @apply flex items-center gap-3;
    }

    .builder-card__icon {
        @apply bg-secondary-50 text-secondary-600 hidden h-8 w-8 shrink-0 items-center justify-center;
        @apply rounded-full sm:flex sm:h-10 sm:w-10;
    }

    .builder-card__title {
        @apply w-full;
    }
}
</style>
