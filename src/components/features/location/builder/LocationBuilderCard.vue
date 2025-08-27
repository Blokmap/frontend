<script setup lang="ts">
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
    icon: IconDefinition;
}>();
</script>

<template>
    <div class="rounded-lg bg-white p-4 shadow-sm">
        <div class="space-y-6">
            <div class="flex items-center space-x-3">
                <div class="icon" v-if="icon">
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
    @apply bg-secondary-50 flex h-10 w-10 shrink-0 items-center justify-center;
    @apply rounded-full;
}
</style>
