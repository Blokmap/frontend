<script setup lang="ts" generic="T = any">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { PIXELS_PER_HOUR, MAX_MINUTES_IN_DAY } from '@/domain/openings/constants';
import { addToDate, datesInRange, isToday, startOfWeek } from '@/utils/date/date';
import {
    addToTime,
    createTime,
    dateToTime,
    getTimeDuration,
    minutesToTime,
    roundToInterval,
    timeToMinutes,
} from '@/utils/date/time';
import CalendarCell from './CalendarCell.vue';
import CalendarDay from './CalendarDay.vue';
import CalendarSlot from './CalendarSlot.vue';
import CalendarTime from './CalendarTime.vue';
import type { TimeSlot, TimeCell, CalendarDragState } from '@/domain/calendar';
import type { Time } from '@/utils/date/time';

const props = withDefaults(
    defineProps<{
        currentWeek: Date;
        timeSlots?: TimeSlot[];
        minDate?: Date;
        maxDate?: Date;
        minSlotDuration?: number;
        enableDragging?: boolean;
    }>(),
    {
        timeSlots: () => [],
        minSlotDuration: 15,
        enableDragging: false,
    },
);

const emit = defineEmits<{
    'click:cell': [timeCell: TimeCell];
    'click:day': [day: Date];
    'drag:slot': [slot: TimeSlot, start: Time, end: Time, day?: Date];
}>();

const currentTime = ref<Date>(new Date());
const dragState = ref<CalendarDragState | null>(null);
const calendarBodyRef = useTemplateRef<HTMLElement>('calendarBodyRef');
const calendarGridRef = useTemplateRef<HTMLElement>('calendarGridRef');

const weekDays = computed<Date[]>(() => {
    const start = startOfWeek(props.currentWeek);
    const end = addToDate(start, 6, 'day');
    return datesInRange(start, end);
});

const currentTimePosition = computed<number>(() => {
    const now = dateToTime(currentTime.value);
    const totalMinutes = timeToMinutes(now);
    return (totalMinutes / (24 * 60)) * 100;
});

/**
 * Checks if a specific day is disabled based on minDate and maxDate props.
 *
 * @param day The day to check.
 * @returns True if the day is disabled, false otherwise.
 */
function isDayDisabled(day: Date): boolean {
    if (props.minDate && day < props.minDate) return true;
    if (props.maxDate && day > props.maxDate) return true;
    return false;
}

/**
 * Retrieves all time slots for a specific day.
 *
 * @param day The day to get time slots for.
 * @returns An array of time slots that fall on the specified day.
 */
function getDayTimeSlots(day: Date): TimeSlot[] {
    return props.timeSlots.filter((slot) => slot.day.toDateString() === day.toDateString());
}

/**
 * Handles the user clicking on a cell in the calendar to add a new opening time.
 *
 * @param day The day that was clicked.
 * @param hour The hour that was clicked (0-23).
 */
function handleCellClick(day: Date, hour: number): void {
    if (isDayDisabled(day)) return;

    const startTime = createTime(hour, 0);
    const endTime = addToTime(startTime, 1, 'hours');

    emit('click:cell', {
        day,
        startTime,
        endTime,
    });
}

/**
 * Scrolls the calendar body to show the current time.
 * Called on mount and can be called whenever needed.
 */
function scrollToCurrentTime(): void {
    if (!calendarBodyRef.value) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const scrollPosition = (currentMinutes / 60) * PIXELS_PER_HOUR;

    calendarBodyRef.value.scrollTo({
        top: Math.max(0, scrollPosition - 100),
        behavior: 'smooth',
    });
}

/**
 * Handles the user clicking on a day header.
 *
 * @param day The day that was clicked.
 */
function handleDayClick(day: Date): void {
    emit('click:day', day);
}

/**
 * Handles the user pressing the mouse button down on a time slot to start dragging or resizing.
 *
 * @param event Mouse down event on the time slot.
 * @param slot The time slot being interacted with.
 * @param mode 'move' to drag the slot, 'resize' to change its end time.
 */
function onMouseDown(event: MouseEvent, slot: TimeSlot<any>, mode: 'move' | 'resize'): void {
    if (!props.enableDragging) return;

    event.preventDefault();
    event.stopPropagation();

    dragState.value = {
        isDragging: true,
        startPosition: { x: event.clientX, y: event.clientY },
        slot,
        mode,
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

/**
 * Handles mouse movement during dragging or resizing of a time slot.
 *
 * @param event Mouse move event during dragging.
 */
function onMouseMove(event: MouseEvent): void {
    if (!dragState.value?.isDragging || !calendarBodyRef.value) return;
    if (!dragState.value.slot) return;

    const { slot, mode, startPosition } = dragState.value;

    const deltaY = event.clientY - startPosition.y;
    const deltaMinutes = roundToInterval(
        Math.round((deltaY / PIXELS_PER_HOUR) * 60),
        props.minSlotDuration,
    );

    let newStart = slot.startTime;
    let newEnd = slot.endTime;
    let newDay = slot.day;

    if (mode === 'move') {
        // Handle cross-day dragging by finding which day column the mouse is over
        if (calendarGridRef.value) {
            const dayColumns = calendarGridRef.value.querySelectorAll('.day-column');

            for (let i = 0; i < dayColumns.length; i++) {
                const dayColumn = dayColumns[i];
                const rect = dayColumn.getBoundingClientRect();

                if (event.clientX >= rect.left && event.clientX <= rect.right) {
                    newDay = weekDays.value[i];
                    break;
                }
            }
        }

        // Calculate new times using Time utilities
        const originalDuration = getTimeDuration(slot.startTime, slot.endTime);
        newStart = addToTime(slot.startTime, deltaMinutes, 'minutes');
        newEnd = addToTime(newStart, originalDuration, 'minutes');

        // Ensure the slot doesn't go beyond day boundaries
        if (timeToMinutes(newEnd) > MAX_MINUTES_IN_DAY) {
            const overflow = timeToMinutes(newEnd) - MAX_MINUTES_IN_DAY;
            newStart = addToTime(newStart, -overflow, 'minutes');
            newEnd = addToTime(newEnd, -overflow, 'minutes');
        }

        // Ensure the slot doesn't go before start of day
        if (timeToMinutes(newStart) < 0) {
            const underflow = -timeToMinutes(newStart);
            newStart = addToTime(newStart, underflow, 'minutes');
            newEnd = addToTime(newEnd, underflow, 'minutes');
        }
    } else if (mode === 'resize') {
        // Only change the end time for resize
        newEnd = addToTime(slot.endTime, deltaMinutes, 'minutes');

        // Ensure minimum duration
        const minEndTime = addToTime(newStart, props.minSlotDuration, 'minutes');

        if (timeToMinutes(newEnd) < timeToMinutes(minEndTime)) {
            newEnd = minEndTime;
        }

        // Ensure doesn't exceed day boundary
        if (timeToMinutes(newEnd) > MAX_MINUTES_IN_DAY) {
            newEnd = minutesToTime(MAX_MINUTES_IN_DAY);
        }
    }

    slot.startTime = newStart;
    slot.endTime = newEnd;
    slot.day = newDay;

    emit('drag:slot', slot, slot.startTime, slot.endTime, newDay);
}

/**
 * Stops the dragging operation and cleans up event listeners.
 */
function onMouseUp(): void {
    if (!dragState.value?.isDragging) return;
    dragState.value = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

onMounted(() => {
    const updateInterval = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    setTimeout(scrollToCurrentTime, 100);

    onUnmounted(() => {
        if (updateInterval) clearInterval(updateInterval);
    });
});
</script>

<template>
    <div class="calendar-container">
        <!-- Scrollable container for both header and body -->
        <div class="calendar-scroll-container">
            <!-- Header with days -->
            <div class="calendar-header">
                <!-- Empty corner for time column -->
                <div></div>

                <!-- Day headers -->
                <template v-for="(day, index) in weekDays" :key="index">
                    <CalendarDay :day="day" @click:day="handleDayClick" />
                </template>
            </div>

            <!-- Calendar body -->
            <div ref="calendarBodyRef" class="relative">
                <!-- Calendar grid -->
                <div ref="calendarGridRef" class="calendar-grid">
                    <!-- Time column -->
                    <div class="time-column">
                        <template v-for="hour in 24" :key="hour">
                            <CalendarTime :hour="hour - 1" />
                        </template>
                    </div>

                    <!-- Day columns -->
                    <div v-for="(day, dayIndex) in weekDays" :key="dayIndex" class="day-column">
                        <!-- Day cells grid for each day -->
                        <CalendarCell
                            v-for="hour in 24"
                            :key="hour"
                            :day="day"
                            :hour="hour - 1"
                            :min-date="minDate"
                            :max-date="maxDate"
                            @click:cell="handleCellClick">
                        </CalendarCell>

                        <!-- Custom time slots positioned absolutely within the day -->
                        <template v-for="slot in getDayTimeSlots(day)" :key="slot.id">
                            <CalendarSlot
                                :pixels-per-hour="PIXELS_PER_HOUR"
                                :slot="slot"
                                :enable-dragging="enableDragging"
                                :drag-state="dragState"
                                @mousedown="onMouseDown">
                                <template #time-slot="{ slot }">
                                    <slot :slot="slot" name="time-slot"></slot>
                                </template>
                            </CalendarSlot>
                        </template>

                        <!-- Current time indicator for today -->
                        <div
                            v-if="isToday(day)"
                            class="pointer-events-none absolute right-0 left-0 z-20"
                            :style="{ top: `${currentTimePosition}%` }">
                            <div class="flex items-center">
                                <div class="-ml-1 h-2 w-2 rounded-full bg-red-500"></div>
                                <div class="h-0.5 flex-1 bg-red-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar-container {
    @apply flex flex-col;
    @apply rounded-lg border border-gray-200 bg-white;
    @apply overflow-hidden;
    min-height: 500px;
    max-height: 75vh;
}

.calendar-scroll-container {
    @apply flex-1 overflow-auto;

    &::-webkit-scrollbar {
        @apply h-2 w-2;
    }

    &::-webkit-scrollbar-track {
        @apply bg-gray-100;
    }

    &::-webkit-scrollbar-thumb {
        @apply rounded bg-gray-300;

        &:hover {
            @apply bg-gray-400;
        }
    }
}

.calendar-header {
    @apply sticky top-0 z-30;
    @apply grid border-b border-gray-200 bg-gray-50;
    grid-template-columns: 80px repeat(7, minmax(120px, 1fr));
    min-width: 920px;

    @media (max-width: 768px) {
        grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
        min-width: 760px;
    }

    & > div {
        @apply border-r border-gray-200 last:border-r-0;
        @apply p-3;

        &:not(:first-child) {
            @apply cursor-pointer text-center;
            @apply transition-colors hover:bg-gray-100;

            &.today {
                @apply bg-secondary-50 text-secondary-500;
            }
        }
    }
}

.calendar-grid {
    @apply relative grid;
    grid-template-columns: 80px repeat(7, minmax(120px, 1fr));
    min-width: 920px;

    @media (max-width: 768px) {
        grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
        min-width: 760px;
    }
}

.time-column {
    @apply sticky left-0 z-20;
    @apply border-r border-gray-200 bg-gray-50;
    min-width: 80px;

    @media (max-width: 768px) {
        min-width: 60px;
    }

    .time-cell {
        @apply border-b border-gray-100;
        @apply p-2 pr-3;
        @apply text-right text-sm text-gray-600;

        @media (max-width: 768px) {
            @apply p-1 pr-2;
            @apply text-xs;
            @apply h-[40px];
        }
    }
}

.day-column {
    @apply relative;
    @apply border-r border-gray-200 last:border-r-0;
    @apply min-w-[120px];

    @media (max-width: 768px) {
        min-width: 100px;
    }

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
}

.custom-time-slot {
    @apply absolute right-0 left-0 z-10 min-h-[20px];
    @apply transition-all duration-150 ease-out;
    overflow: visible;
    user-select: none;

    &.draggable {
        @apply cursor-move;

        &:hover .resize-handle {
            @apply opacity-100;
        }
    }

    &.dragging {
        @apply transition-none;
    }

    &.resize-mode {
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
