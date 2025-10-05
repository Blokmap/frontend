<script setup lang="ts">
import { PIXELS_PER_HOUR } from '@/domain/openings';

defineProps<{
    hour: number;
}>();
</script>

<template>
    <div class="time-cell" :style="{ height: PIXELS_PER_HOUR + 'px' }">
        {{ hour.toString().padStart(2, '0') }}:00
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.time-cell {
    @apply border-b border-gray-100;
    @apply p-2 pr-3;
    @apply text-right text-sm text-gray-600;

    @media (max-width: 768px) {
        @apply h-[40px] p-1 pr-2 text-xs;
    }
}
</style>
