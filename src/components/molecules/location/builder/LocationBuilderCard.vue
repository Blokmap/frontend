<script setup lang="ts">
import Card from 'primevue/card';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

defineProps<{
    icon: IconDefinition;
}>();
</script>

<template>
    <Card class="card">
        <template #header>
            <div class="card__header">
                <div v-if="icon" class="card__icon">
                    <FontAwesomeIcon :icon="icon" />
                </div>
                <div class="card__title">
                    <slot name="header"></slot>
                </div>
            </div>
        </template>
        <template #content>
            <div class="card__body">
                <slot name="default"></slot>
            </div>
        </template>
    </Card>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.card {
    .card__header {
        @apply flex items-center gap-3 p-4 pb-0;

        .card__icon {
            @apply bg-primary-50 text-primary-700 hidden h-13 w-13 shrink-0 items-center justify-center sm:flex;
            @apply rounded-full;
        }

        .card__title {
            @apply w-full space-y-1;
        }
    }

    .card__body {
        @apply space-y-4;
    }
}
</style>
