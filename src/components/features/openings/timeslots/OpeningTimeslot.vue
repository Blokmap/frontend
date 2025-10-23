<script setup lang="ts">
import { timeToString } from '@/utils/time';
import type { Time } from '@/utils/time';

defineProps<{
    startTime: Time;
    endTime: Time;
}>();

defineEmits<{
    click: [event: Event];
}>();
</script>

<template>
    <div class="opening-time-card" @click="$emit('click', $event)">
        <div class="time-display">
            <span class="time-text">
                {{ timeToString(startTime) }}-{{ timeToString(endTime) }}
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.opening-time-card {
    @apply relative h-full bg-slate-100;
    @apply flex items-center justify-center p-2;
    @apply cursor-pointer;
    @apply hover:bg-slate-200;

    .time-display {
        @apply text-slate-600;
    }
}

.time-display {
    @apply flex items-center justify-center text-center;

    .time-text {
        @apply text-xs font-semibold;
    }
}
</style>
