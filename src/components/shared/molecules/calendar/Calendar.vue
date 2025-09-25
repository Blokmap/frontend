<script setup lang="ts" generic="T = any">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { datesInRange, formatDayName, isToday, startOfWeek } from '@/utils/date/date';
import {
    addToTime,
    createTime,
    getTimeDuration,
    minutesToTime,
    roundToInterval,
    timeToMinutes,
} from '@/utils/date/time';
import type { TimeCell, TimeSlot } from '@/domain/openings';
import type { Time } from '@/utils/date/time';

const PIXELS_PER_HOUR = 50;
const MAX_MINUTES_IN_DAY = 1440;

type CalendarDragState = {
    isDragging: boolean;
    slot: TimeSlot<any> | null;
    mode: 'move' | 'resize';
    startPosition: { x: number; y: number };
    originalTimes: { start: Time; end: Time; day: Date };
    lastEmitted: { start: Time; end: Time; day: Date | null };
};

const props = withDefaults(
    defineProps<{
        currentWeek: Date;
        timeSlots?: TimeSlot<any>[];
        minDate?: Date;
        maxDate?: Date;
        timeInterval?: number;
        minSlotDuration?: number;
        enableDragging?: boolean;
    }>(),
    {
        timeSlots: () => [],
        timeInterval: 15,
        minSlotDuration: 15,
        enableDragging: false,
    },
);

const emit = defineEmits<{
    'click:cell': [timeCell: TimeCell];
    'click:day': [day: Date];
    'drag:slot': [slot: TimeSlot<any>, start: Time, end: Time, day?: Date];
}>();

const { locale } = useI18n();

const updateInterval = ref<number>(0);
const currentTime = ref(new Date());
const calendarBodyRef = useTemplateRef<HTMLElement>('calendarBodyRef');
const calendarGridRef = useTemplateRef<HTMLElement>('calendarGridRef');
const dragState = ref<CalendarDragState | null>(null);

const weekDays = computed(() => {
    const start = startOfWeek(props.currentWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
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

onMounted(() => {
    updateInterval.value = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);
    setTimeout(scrollToCurrentTime, 100);
});

onUnmounted(() => {
    if (updateInterval.value) clearInterval(updateInterval.value);
});

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

function handleDayCellClick(day: Date, hour: number): void {
    if (isDayDisabled(day)) return;
    const startTime = createTime(hour, 0);
    const endTime = addToTime(startTime, props.timeInterval, 'minutes');
    emit('click:cell', {
        day,
        startTime,
        endTime,
    });
}

function handleDayClick(day: Date): void {
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
        originalTimes: {
            start: slot.startTime,
            end: slot.endTime,
            day: new Date(slot.day),
        },
        lastEmitted: {
            start: slot.startTime,
            end: slot.endTime,
            day: new Date(slot.day),
        },
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseMove(event: MouseEvent): void {
    if (!dragState.value?.isDragging || !calendarBodyRef.value) return;

    const { slot, mode, startPosition, originalTimes } = dragState.value;

    const deltaY = event.clientY - startPosition.y;
    const deltaMinutes = roundToInterval(
        Math.round((deltaY / PIXELS_PER_HOUR) * 60),
        props.timeInterval,
    );

    let newStart = originalTimes.start;
    let newEnd = originalTimes.end;
    let newDay = originalTimes.day;

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
        newStart = addToTime(originalTimes.start, deltaMinutes, 'minutes');
        const originalDuration = getTimeDuration(originalTimes.start, originalTimes.end);
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
        newEnd = addToTime(originalTimes.end, deltaMinutes, 'minutes');

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

    if (slot) {
        slot.startTime = newStart;
        slot.endTime = newEnd;
        slot.day = newDay;

        const dayChanged = newDay.toDateString() !== originalTimes.day.toDateString();
        emit('drag:slot', slot, slot.startTime, slot.endTime, dayChanged ? newDay : undefined);
    }
}

function onMouseUp(): void {
    if (!dragState.value?.isDragging) return;
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
                <div />

                <!-- Day headers -->
                <div
                    v-for="(day, index) in weekDays"
                    :key="index"
                    :class="{ today: isToday(day) }"
                    @click="handleDayClick(day)">
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
                            @click="handleDayCellClick(day, hour - 1)" />

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
                                        class="bg-primary-500 h-1 w-8 rounded-full transition-all duration-200" />
                                </div>
                            </div>
                        </template>

                        <!-- Current time indicator for today -->
                        <div
                            v-if="isToday(day)"
                            class="pointer-events-none absolute right-0 left-0 z-20"
                            :style="{ top: `${currentTimePosition}%` }">
                            <div class="flex items-center">
                                <div class="-ml-1 h-2 w-2 rounded-full bg-red-500" />
                                <div class="h-0.5 flex-1 bg-red-500" />
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
