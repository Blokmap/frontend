<script setup lang="ts">
import { PIXELS_PER_HOUR } from '@/domain/openings/constants';

const props = defineProps<{
    day: Date;
    hour: number;
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    'click:cell': [day: Date, hour: number];
}>();

function isDayDisabled(day: Date): boolean {
    if (props.minDate && day < props.minDate) return true;
    if (props.maxDate && day > props.maxDate) return true;
    return false;
}

function handleCellClick(): void {
    if (isDayDisabled(props.day)) return;
    emit('click:cell', props.day, props.hour);
}
</script>

<template>
    <div
        class="day-cell"
        :class="{ disabled: isDayDisabled(day) }"
        :style="{ height: PIXELS_PER_HOUR + 'px' }"
        @click="handleCellClick"></div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.day-cell {
    @apply relative cursor-pointer;
    @apply border-b border-gray-100;
    @apply hover:bg-primary-50 transition-colors;

    &.disabled {
        @apply cursor-not-allowed bg-gray-200 opacity-40;

        &:hover {
            @apply bg-gray-200;
        }
    }
}
</style>
