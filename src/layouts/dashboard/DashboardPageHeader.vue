<script setup lang="ts">
defineProps<{
    title?: string;
    subtitle?: string;
    metadata?: string;
}>();
</script>

<template>
    <div class="dashboard-header">
        <div class="header-main">
            <div class="header-text">
                <h1 v-if="$slots.title || title" class="header-title">
                    <slot name="title">{{ title }}</slot>
                </h1>
                <div v-if="$slots.subtitle || subtitle" class="header-subtitle">
                    <slot name="subtitle">{{ subtitle }}</slot>
                </div>
                <div v-if="$slots.metadata || metadata" class="header-metadata">
                    <slot name="metadata">{{ metadata }}</slot>
                </div>
            </div>

            <div v-if="$slots.actions" class="header-actions">
                <slot name="actions"></slot>
            </div>
        </div>

        <div v-if="$slots.filters" class="header-filters">
            <slot name="filters"></slot>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.dashboard-header {
    @apply w-full space-y-3;
    @apply md:space-y-4;

    .header-main {
        @apply flex w-full flex-col items-start justify-between gap-3;
        @apply sm:flex-row sm:items-center sm:gap-4;

        .header-text {
            @apply space-y-2;

            .header-title {
                @apply text-2xl font-bold text-slate-900;
                @apply md:text-3xl;
            }

            .header-subtitle {
                @apply text-sm text-slate-600;
                @apply md:text-base;
            }

            .header-metadata {
                @apply text-xs text-slate-500;
                @apply md:text-sm;
            }
        }

        .header-actions {
            @apply flex flex-wrap items-center gap-2;
            @apply w-full sm:w-auto;
        }
    }

    .header-filters {
        @apply w-full;
    }
}
</style>
