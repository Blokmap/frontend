<script setup lang="ts" generic="T = any">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { PIXELS_PER_HOUR, MAX_MINUTES_IN_DAY } from '@/domain/openings';
import { addToDate, datesInRange, formatDayName, isToday, startOfWeek } from '@/utils/date';
import {
    addToTime,
    createTime,
    getTimeDuration,
    minutesToTime,
    roundToInterval,
    timeToMinutes,
} from '@/utils/time';
import type { TimeSlot, TimeCell, CalendarDragState } from '@/domain/calendar';
import type { Time } from '@/utils/time';

const props = withDefaults(
    defineProps<{
        currentWeek: Date;
        timeSlots?: TimeSlot<T>[];
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
    'drag:slot': [slot: TimeSlot<T>, start: Time, end: Time, day: Date];
}>();

onMounted(() => {
    const updateInterval = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    onUnmounted(() => clearInterval(updateInterval));
});

const { locale } = useI18n();

const currentTime = ref(new Date());
const calendarBodyRef = useTemplateRef<HTMLElement>('calendarBodyRef');
const calendarGridRef = useTemplateRef<HTMLElement>('calendarGridRef');
const dragState = ref<CalendarDragState | null>(null);

const weekDays = computed(() => {
    const start = startOfWeek(props.currentWeek);
    const end = addToDate(start, 6, 'day');
    return datesInRange(start, end);
});

const currentTimePosition = computed(() => {
    const now = currentTime.value;
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return (totalMinutes / (24 * 60)) * 100;
});

function isDayDisabled(day: Date): boolean {
    if (props.minDate && day < props.minDate) return true;
    if (props.maxDate && day > props.maxDate) return true;
    return false;
}

function getDayTimeSlots(day: Date): TimeSlot<any>[] {
    return props.timeSlots.filter((slot) => slot.day.toDateString() === day.toDateString());
}

function getSlotPosition(slot: TimeSlot<any>): { top: string; height: string } {
    const startTotalMinutes = timeToMinutes(slot.startTime);
    const endTotalMinutes = timeToMinutes(slot.endTime);
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    const pixelsPerMinute = PIXELS_PER_HOUR / 60;

    return {
        top: `${startTotalMinutes * pixelsPerMinute}px`,
        height: `${Math.max(durationMinutes * pixelsPerMinute, 20)}px`,
    };
}

function onCellClick(day: Date, hour: number): void {
    if (isDayDisabled(day)) return;

    const startTime = createTime(hour, 0);
    const endTime = addToTime(startTime, 1, 'hours');

    emit('click:cell', {
        day,
        startTime,
        endTime,
    });
}

function onDayClick(day: Date): void {
    emit('click:day', day);
}

function onMouseDown(event: MouseEvent, slot: TimeSlot<any>, mode: 'move' | 'resize'): void {
    if (!props.enableDragging) return;

    event.preventDefault();
    event.stopPropagation();

    dragState.value = {
        isDragging: true,
        slot,
        mode,
        startPosition: { x: event.clientX, y: event.clientY },
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

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
        newStart = addToTime(slot.startTime, deltaMinutes, 'minutes');
        const originalDuration = getTimeDuration(slot.startTime, slot.endTime);
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

    emit('drag:slot', slot, newStart, newEnd, newDay);
}

function onMouseUp(): void {
    dragState.value = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}
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
                <div
                    v-for="(day, index) in weekDays"
                    :key="index"
                    :class="{ today: isToday(day) }"
                    @click="onDayClick(day)">
                    <div class="text-sm font-medium md:text-xs">
                        {{ formatDayName(day, 'short', locale) }}
                    </div>
                    <div
                        class="mt-1 text-lg font-semibold md:text-base"
                        :class="{ 'today-indicator': isToday(day) }">
                        {{ day.getDate() }}
                    </div>
                </div>
            </div>

            <!-- Calendar body -->
            <div ref="calendarBodyRef" class="relative">
                <!-- Calendar grid -->
                <div ref="calendarGridRef" class="calendar-grid">
                    <!-- Time column -->
                    <div class="time-column">
                        <div
                            v-for="hour in 24"
                            :key="hour"
                            class="time-cell"
                            :style="{ height: PIXELS_PER_HOUR + 'px' }">
                            {{ (hour - 1).toString().padStart(2, '0') }}:00
                        </div>
                    </div>

                    <!-- Day columns -->
                    <div v-for="(day, dayIndex) in weekDays" :key="dayIndex" class="day-column">
                        <!-- Day cells grid for each day -->
                        <div
                            v-for="hour in 24"
                            :key="hour"
                            class="day-cell"
                            :class="{ disabled: isDayDisabled(day) }"
                            :style="{ height: PIXELS_PER_HOUR + 'px' }"
                            @click="onCellClick(day, hour - 1)"></div>

                        <!-- Custom time slots positioned absolutely within the day -->
                        <template v-for="slot in getDayTimeSlots(day)" :key="slot.id">
                            <div
                                class="custom-time-slot"
                                :class="{
                                    dragging:
                                        dragState?.isDragging && dragState?.slot?.id === slot.id,
                                    'resize-mode':
                                        dragState?.isDragging &&
                                        dragState?.slot?.id === slot.id &&
                                        dragState?.mode === 'resize',
                                    draggable: props.enableDragging,
                                }"
                                :style="getSlotPosition(slot)"
                                @mousedown="onMouseDown($event, slot, 'move')">
                                <slot :slot="slot" name="time-slot" />

                                <!-- Resize handle - only show if dragging is enabled -->
                                <div
                                    v-if="props.enableDragging"
                                    class="resize-handle"
                                    @mousedown="onMouseDown($event, slot, 'resize')">
                                    <div
                                        class="bg-primary-500 h-1 w-8 rounded-full transition-all duration-200"></div>
                                </div>
                            </div>
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
    @apply flex max-h-[75vh] min-h-[500px] flex-col;
    @apply rounded-lg border border-gray-200 bg-white;
    @apply overflow-hidden;
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

.today-indicator {
    @apply mx-auto flex;
    @apply h-8 w-8;
    @apply items-center justify-center;
    @apply bg-secondary-500 rounded-full text-white;

    @media (max-width: 768px) {
        @apply h-6 w-6;
        @apply text-sm;
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
