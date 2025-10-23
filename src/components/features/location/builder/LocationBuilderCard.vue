<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

defineProps<{
    icon: IconDefinition;
}>();
</script>

<template>
    <div class="rounded-lg border-1 border-slate-200 bg-white p-3 sm:p-4">
        <div class="space-y-4 sm:space-y-6">
            <div class="flex items-center gap-3">
                <div v-if="icon" class="icon hidden sm:flex">
                    <FontAwesomeIcon :icon="icon" class="text-secondary-600" />
                </div>
                <div class="w-full">
                    <slot name="header"></slot>
                </div>
            </div>
            <slot name="default"></slot>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.icon {
    @apply bg-secondary-50 h-8 w-8 shrink-0 items-center justify-center;
    @apply rounded-full;
    @apply sm:h-10 sm:w-10;
}
</style>
