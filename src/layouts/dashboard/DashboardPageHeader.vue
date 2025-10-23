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
            <h1 v-if="$slots.title || title" class="header-title">
                <slot name="title">{{ title }}</slot>
            </h1>

            <div v-if="$slots.actions" class="header-actions">
                <slot name="actions"></slot>
            </div>
        </div>

        <div v-if="$slots.subtitle || subtitle" class="header-subtitle">
            <slot name="subtitle">{{ subtitle }}</slot>
        </div>

        <div v-if="$slots.metadata || metadata" class="header-metadata">
            <slot name="metadata">{{ metadata }}</slot>
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

    .header-main {
        @apply flex w-full flex-wrap items-center justify-center gap-4;

        .header-title {
            @apply flex-1 text-2xl font-bold text-slate-900;
            @apply md:text-3xl;
        }

        .header-actions {
            @apply flex flex-wrap items-center gap-4;
        }
    }

    .header-subtitle {
        @apply text-sm text-slate-600;
        @apply md:text-base;
    }

    .header-metadata {
        @apply text-xs text-slate-500;
        @apply md:text-sm;
    }

    .header-filters {
        @apply w-full;
    }
}
</style>
