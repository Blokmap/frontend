<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

defineProps<{
    icon: IconDefinition;
}>();
</script>

<template>
    <div class="rounded-lg border-1 border-slate-200 bg-white p-4">
        <div class="space-y-6">
            <div class="flex items-center space-x-3">
                <div v-if="icon" class="icon">
                    <FontAwesomeIcon :icon="icon" class="text-secondary-600" />
                </div>
                <div class="w-full">
                    <slot name="header" />
                </div>
            </div>
            <slot name="default" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.icon {
    @apply bg-secondary-50 flex h-10 w-10 shrink-0 items-center justify-center;
    @apply rounded-full;
}
</style>
