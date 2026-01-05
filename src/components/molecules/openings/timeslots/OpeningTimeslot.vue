<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { timeToString } from '@/utils/time';
import type { Time } from '@/utils/time';

const { disabled } = defineProps<{
    startTime: Time;
    endTime: Time;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    click: [event: Event, timeRef: HTMLElement];
}>();

const timeRef = useTemplateRef<HTMLElement>('time');

const onTimeslotClick = (event: Event) => {
    if (!disabled) {
        emit('click', event, timeRef.value!);
    }
};
</script>

<template>
    <div class="opening-time-card" :class="{ disabled }" @click="onTimeslotClick">
        <!-- Time display (centered) -->
        <div class="time-display">
            <span class="time-text" ref="time">
                {{ timeToString(startTime) }}-{{ timeToString(endTime) }}
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.opening-time-card {
    @apply relative flex items-center justify-center p-2;
    @apply h-full rounded-lg bg-slate-100 transition-colors hover:bg-slate-200;
    @apply pointer-events-auto cursor-pointer overflow-hidden;

    &.disabled {
        @apply cursor-not-allowed;
        @apply bg-gray-100 hover:bg-gray-100;

        background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(0, 0, 0, 0.03) 10px,
            rgba(0, 0, 0, 0.03) 20px
        );

        .time-display {
            @apply text-gray-400;
        }
    }

    .time-display {
        @apply relative hidden items-center justify-center text-center md:flex;
        @apply text-slate-600;
        @apply z-10;

        .time-text {
            @apply text-xs font-semibold;
        }
    }
}
</style>
