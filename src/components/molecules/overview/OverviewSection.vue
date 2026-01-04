<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';

defineProps<{
    loading?: boolean;
    title?: string | null;
    subtitle?: string | null;
}>();
</script>

<template>
    <section class="section">
        <Skeleton v-if="loading" height="28px" width="400px" />
        <hgroup v-else="!loading" class="section__header">
            <h2 class="section__title">
                <slot name="title">
                    {{ title }}
                </slot>
                <div v-if="$slots.actions" class="section__actions">
                    <slot name="actions"> </slot>
                </div>
            </h2>
            <p v-if="subtitle" class="section__subtitle">
                {{ subtitle }}
            </p>
        </hgroup>

        <slot></slot>
    </section>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.section {
    @apply space-y-8;

    .section__header {
        @apply space-y-1;
    }

    .section__title {
        @apply flex items-center justify-between;
        @apply text-2xl font-semibold text-gray-900;

        .section__actions {
            @apply flex items-center gap-2;
        }
    }

    .section__subtitle {
        @apply text-slate-500;
    }
}
</style>
