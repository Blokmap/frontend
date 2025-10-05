<script setup lang="ts" generic="T = any">
import { computed } from 'vue';
import { PIXELS_PER_HOUR, type CalendarDragState, type TimeSlot } from '@/domain/openings';
import { timeToMinutes } from '@/utils/date/time';

const { dragState, slot } = defineProps<{
    slot: TimeSlot<T>;
    enableDragging: boolean;
    dragState: CalendarDragState | null;
}>();

const emit = defineEmits<{
    mousedown: [event: MouseEvent, slot: TimeSlot<T>, mode: 'move' | 'resize'];
}>();

const isDragging = computed(() => {
    return dragState?.isDragging && dragState?.slot?.id === slot.id;
});

const isResizing = computed(() => {
    return isDragging.value && dragState?.mode === 'resize';
});

/**
 * Get the position of a time slot in the calendar.
 *
 * @param slot The time slot to calculate the position for.
 * @return An object containing the top and height in pixels.
 */
function getSlotPosition(slot: TimeSlot): { top: string; height: string } {
    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);

    const duration = end - start;
    const ppm = PIXELS_PER_HOUR / 60;

    return {
        top: `${start * ppm}px`,
        height: `${Math.max(duration * ppm, 20)}px`,
    };
}

/**
 * Handle mouse down event for dragging or resizing the time slot.
 *
 * @param event The mouse event.
 * @param mode The mode of interaction (move or resize).
 */
function onMouseDown(event: MouseEvent, mode: 'move' | 'resize'): void {
    emit('mousedown', event, slot, mode);
}
</script>

<template>
    <div
        class="custom-time-slot"
        :class="{
            dragging: isDragging,
            resizing: isResizing,
            draggable: enableDragging,
        }"
        :style="getSlotPosition(slot)"
        @mousedown="onMouseDown($event, 'move')">
        <!-- Slot content -->
        <slot :slot="slot" name="time-slot"></slot>

        <!-- Resize handle -->
        <div v-if="enableDragging" class="resize-handle" @mousedown="onMouseDown($event, 'resize')">
            <div class="bg-primary-500 h-1 w-8 rounded-full transition-all duration-200"></div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.custom-time-slot {
    @apply absolute right-0 left-0 z-10 min-h-[20px];
    @apply transition-all duration-150 ease-out;
    @apply overflow-visible select-none;

    &.draggable {
        @apply cursor-move;

        &:hover .resize-handle {
            @apply opacity-100;
        }
    }

    &.dragging {
        @apply transition-none;
    }

    &.resizing {
        @apply cursor-ns-resize;

        .resize-handle {
            @apply opacity-100;

            > div {
                @apply scale-110;
            }
        }
    }

    .resize-handle {
        @apply absolute right-0 bottom-0 left-0;
        @apply h-4;
        @apply cursor-ns-resize;
        @apply bg-transparent;
        @apply opacity-0;
        @apply transition-all duration-200;
        @apply flex items-center justify-center;

        &:hover > div {
            @apply bg-primary-600 scale-110;
        }
    }
}
</style>
