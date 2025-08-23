<script setup lang="ts">
import { datesInRange, formatDayName, isToday, startOfWeek } from '@/utils/date/date';
import type { Time } from '@/utils/date/time';
import { createTime, fromTotalMinutes, parseTimeString, toTotalMinutes } from '@/utils/date/time';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export type CalendarTimeSlot<T = any> = {
    id: string;
    day: Date;
    startTime: Time;
    endTime: Time;
    duration: {
        hours: number;
        minutes: number;
    };
    metadata?: T;
};

const props = withDefaults(
    defineProps<{
        currentWeek: Date;
        timeSlots?: CalendarTimeSlot<any>[];
        minDate?: Date;
        maxDate?: Date;
    }>(),
    {
        timeSlots: () => [],
        minDate: undefined,
        maxDate: undefined,
    },
);

const emit = defineEmits<{
    'click:time-slot': [slot: { day: Date; time: string }];
    'click:day': [day: Date];
    'drag:slot': [
        slot: CalendarTimeSlot<any>,
        newStartTime: string,
        newEndTime: string,
        newDay?: Date,
    ];
}>();

const { locale } = useI18n();

const updateInterval = ref<number>(0);
const currentTime = ref(new Date());
const calendarBodyRef = ref<HTMLElement>();

const isDragging = ref(false);
const dragSlot = ref<CalendarTimeSlot<any> | null>(null);
const dragStartY = ref(0);
const dragStartX = ref(0);
const dragMode = ref<'move' | 'resize'>('move');
const dragOriginalStart = ref(0);
const dragOriginalEnd = ref(0);
const dragOriginalDay = ref<Date | null>(null);
const dragCurrentDay = ref<Date | null>(null);

const weekDays = computed(() => {
    const start = startOfWeek(props.currentWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return datesInRange(start, end);
});

const hourlyTimePeriods = computed(() =>
    Array.from({ length: 24 }, (_, hour) => `${hour.toString().padStart(2, '0')}:00`),
);

const currentTimePosition = computed(() => {
    const now = currentTime.value;
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return (totalMinutes / (24 * 60)) * 100;
});

onMounted(() => {
    updateInterval.value = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);
    setTimeout(scrollToCurrentTime, 100);
});

onUnmounted(() => {
    if (updateInterval.value) clearInterval(updateInterval.value);
});

const isDayDisabled = (day: Date): boolean => {
    if (props.minDate && day < props.minDate) return true;
    if (props.maxDate && day > props.maxDate) return true;
    return false;
};

const getDayTimeSlots = (day: Date): CalendarTimeSlot<any>[] =>
    props.timeSlots.filter((slot) => slot.day.toDateString() === day.toDateString());

const getSlotPosition = (slot: CalendarTimeSlot<any>): { top: string; height: string } => {
    const startParsed = parseTimeString(slot.startTime);
    const endParsed = parseTimeString(slot.endTime);
    const startMinutes = toTotalMinutes(startParsed.hours, startParsed.minutes);
    const endMinutes = toTotalMinutes(endParsed.hours, endParsed.minutes);
    const durationMinutes = endMinutes - startMinutes;
    const pixelsPerMinute = 50 / 60; // 50px per hour

    return {
        top: `${startMinutes * pixelsPerMinute}px`,
        height: `${Math.max(durationMinutes * pixelsPerMinute, 20)}px`,
    };
};

const roundToInterval = (minutes: number, interval = 15): number =>
    Math.round(minutes / interval) * interval;

function scrollToCurrentTime(): void {
    if (!calendarBodyRef.value) return;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const scrollPosition = (currentMinutes / 60) * 50; // 50px per hour
    calendarBodyRef.value.scrollTo({
        top: Math.max(0, scrollPosition - 100),
        behavior: 'smooth',
    });
}

function handleTimePeriodClick(day: Date, time: string): void {
    if (isDayDisabled(day)) return;
    emit('click:time-slot', { day, time });
}

function handleDayClick(day: Date): void {
    emit('click:day', day);
}

function handleSlotMouseDown(event: MouseEvent, slot: CalendarTimeSlot<any>): void {
    event.preventDefault();
    event.stopPropagation();

    isDragging.value = true;
    dragSlot.value = slot;
    dragStartY.value = event.clientY;
    dragStartX.value = event.clientX;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const isNearBottom = event.clientY - rect.top > rect.height - 10;
    dragMode.value = isNearBottom ? 'resize' : 'move';

    const startParsed = parseTimeString(slot.startTime);
    const endParsed = parseTimeString(slot.endTime);
    dragOriginalStart.value = toTotalMinutes(startParsed.hours, startParsed.minutes);
    dragOriginalEnd.value = toTotalMinutes(endParsed.hours, endParsed.minutes);
    dragOriginalDay.value = new Date(slot.day);
    dragCurrentDay.value = new Date(slot.day);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

function handleMouseMove(event: MouseEvent): void {
    if (!isDragging.value || !dragSlot.value || !calendarBodyRef.value) return;

    const deltaY = event.clientY - dragStartY.value;
    const pixelsPerMinute = 50 / 60;
    const deltaMinutes = Math.round(deltaY / pixelsPerMinute);
    const roundedDeltaMinutes = roundToInterval(deltaMinutes, 15);

    // Handle cross-day dragging
    let newDay = dragOriginalDay.value;
    if (dragMode.value === 'move') {
        const timePeriodsGrid = calendarBodyRef.value.querySelector('.time-periods-grid');
        if (timePeriodsGrid) {
            const gridRect = timePeriodsGrid.getBoundingClientRect();
            const timeColumnWidth = 80;
            const dayColumnWidth = (gridRect.width - timeColumnWidth) / 7;
            const relativeX = event.clientX - gridRect.left - timeColumnWidth;
            const dayIndex = Math.floor(relativeX / dayColumnWidth);

            if (dayIndex >= 0 && dayIndex < weekDays.value.length) {
                newDay = weekDays.value[dayIndex];
                dragCurrentDay.value = newDay;
            }
        }
    }

    // Calculate new times
    let newStartMinutes = dragOriginalStart.value;
    let newEndMinutes = dragOriginalEnd.value;

    if (dragMode.value === 'move') {
        newStartMinutes = dragOriginalStart.value + roundedDeltaMinutes;
        newEndMinutes = dragOriginalEnd.value + roundedDeltaMinutes;
    } else {
        newEndMinutes = dragOriginalEnd.value + roundedDeltaMinutes;
        if (newEndMinutes <= newStartMinutes) {
            newEndMinutes = newStartMinutes + 15;
        }
    }

    // Constrain to valid bounds
    newStartMinutes = Math.max(0, Math.min(1425, newStartMinutes));
    newEndMinutes = Math.max(15, Math.min(1440, newEndMinutes));

    if (newEndMinutes <= newStartMinutes) {
        if (dragMode.value === 'move') {
            newEndMinutes = newStartMinutes + (dragOriginalEnd.value - dragOriginalStart.value);
        } else {
            newEndMinutes = newStartMinutes + 15;
        }
    }

    // Update slot for real-time visual feedback
    const startTime = fromTotalMinutes(newStartMinutes);
    const endTime = fromTotalMinutes(newEndMinutes);

    dragSlot.value.startTime = createTime(startTime.hours, startTime.minutes);
    dragSlot.value.endTime = createTime(endTime.hours, endTime.minutes);
    if (newDay) {
        dragSlot.value.day = newDay;
    }
}

function handleMouseUp(): void {
    if (!isDragging.value || !dragSlot.value) return;

    const startParsed = parseTimeString(dragSlot.value.startTime);
    const endParsed = parseTimeString(dragSlot.value.endTime);

    const startTimeString = createTime(startParsed.hours, startParsed.minutes);
    const endTimeString = createTime(endParsed.hours, endParsed.minutes);

    const newDay =
        dragCurrentDay.value &&
        dragOriginalDay.value &&
        dragCurrentDay.value.toDateString() !== dragOriginalDay.value.toDateString()
            ? dragCurrentDay.value
            : undefined;

    emit('drag:slot', dragSlot.value, startTimeString, endTimeString, newDay);

    // Cleanup
    isDragging.value = false;
    dragSlot.value = null;
    dragMode.value = 'move';
    dragOriginalDay.value = null;
    dragCurrentDay.value = null;

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
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
                    @click="handleDayClick(day)">
                    <div class="day-header-name">{{ formatDayName(day, 'short', locale) }}</div>
                    <div class="day-header-number" :class="{ 'today-indicator': isToday(day) }">
                        {{ day.getDate() }}
                    </div>
                </div>
            </div>

            <!-- Calendar body -->
            <div ref="calendarBodyRef" class="calendar-body">
                <!-- Time periods grid -->
                <div class="time-periods-grid">
                    <!-- Time column -->
                    <div class="time-column">
                        <div v-for="time in hourlyTimePeriods" :key="time" class="time-period">
                            {{ time }}
                        </div>
                    </div>

                    <!-- Day columns -->
                    <div v-for="(day, dayIndex) in weekDays" :key="dayIndex" class="day-column">
                        <!-- Time period grid for each day -->
                        <div
                            v-for="time in hourlyTimePeriods"
                            :key="time"
                            class="time-period-cell"
                            :class="{ disabled: isDayDisabled(day) }"
                            @click="handleTimePeriodClick(day, time)"></div>

                        <!-- Custom time slots positioned absolutely within the day -->
                        <template v-for="slot in getDayTimeSlots(day)" :key="slot.id">
                            <Transition name="slide-up" appear>
                                <div
                                    class="custom-time-slot"
                                    :class="{
                                        dragging: isDragging && dragSlot?.id === slot.id,
                                        'resize-mode':
                                            isDragging &&
                                            dragSlot?.id === slot.id &&
                                            dragMode === 'resize',
                                    }"
                                    :style="getSlotPosition(slot)"
                                    @mousedown="handleSlotMouseDown($event, slot)">
                                    <slot name="time-slot" :slot="slot"> </slot>
                                    <!-- Resize handle -->
                                    <div class="resize-handle"></div>
                                </div>
                            </Transition>
                        </template>

                        <!-- Current time indicator for today -->
                        <div
                            v-if="isToday(day)"
                            class="current-time-indicator"
                            :style="{ top: `${currentTimePosition}%` }">
                            <div class="time-line">
                                <div class="time-dot"></div>
                                <div class="time-line-bar"></div>
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

.day-header-name {
    @apply text-sm font-medium;

    @media (max-width: 768px) {
        @apply text-xs;
    }
}

.day-header-number {
    @apply mt-1;
    @apply text-lg font-semibold;

    @media (max-width: 768px) {
        @apply text-base;
    }

    &.today-indicator {
        @apply mx-auto flex;
        @apply h-8 w-8;
        @apply items-center justify-center;
        @apply bg-secondary-500 rounded-full text-white;

        @media (max-width: 768px) {
            @apply h-6 w-6;
            @apply text-sm;
        }
    }
}

.calendar-body {
    @apply relative;

    .time-periods-grid {
        @apply relative grid;
        grid-template-columns: 80px repeat(7, minmax(120px, 1fr));
        min-width: 920px;

        @media (max-width: 768px) {
            grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
            min-width: 760px;
        }
    }
}

.time-column {
    @apply sticky left-0 z-20;
    @apply border-r border-gray-200 bg-gray-50;
    min-width: 80px;

    @media (max-width: 768px) {
        min-width: 60px;
    }

    .time-period {
        @apply border-b border-gray-100;
        @apply p-2 pr-3;
        @apply text-right text-sm text-gray-600;
        @apply h-[50px];

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

    .time-period-cell {
        @apply relative cursor-pointer;
        @apply border-b border-gray-100;
        @apply hover:bg-primary-50 transition-colors;
        height: 50px;

        @media (max-width: 768px) {
            height: 40px;
        }

        &:hover::before {
            @apply pointer-events-none absolute inset-0;
        }

        &.disabled {
            @apply cursor-not-allowed bg-gray-200 opacity-40;
            @apply relative;

            &:hover {
                @apply bg-gray-200;
            }
        }
    }
}

.custom-time-slot {
    @apply absolute right-0 left-0 z-10 min-h-[20px];
    @apply cursor-move;
    @apply transition-all duration-150 ease-out;
    overflow: visible;
    user-select: none;

    &.dragging {
        @apply z-30;
        @apply transition-none;
    }

    &.resize-mode {
        @apply cursor-ns-resize;

        .resize-handle {
            @apply bg-primary-400 opacity-100;
        }
    }

    &:hover .resize-handle {
        @apply opacity-100;
    }
}

.resize-handle {
    @apply absolute right-0 bottom-0 left-0;
    @apply h-2;
    @apply cursor-ns-resize;
    @apply bg-transparent;
    @apply opacity-0;
    @apply transition-all duration-200;
    @apply hover:bg-primary-300;

    &::after {
        content: '';
        @apply absolute bottom-0 left-1/2 -translate-x-1/2 transform;
        @apply h-1 w-8;
        @apply bg-primary-600;
        @apply rounded-full;
        @apply opacity-0;
        @apply transition-opacity duration-200;
    }

    &:hover::after {
        @apply opacity-100;
    }
}

.current-time-indicator {
    @apply pointer-events-none absolute right-0 left-0 z-20;

    .time-line {
        @apply flex items-center;

        .time-dot {
            @apply -ml-1;
            @apply h-2 w-2;
            @apply rounded-full bg-red-500;
        }

        .time-line-bar {
            @apply flex-1;
            @apply h-0.5 bg-red-500;
        }
    }
}
</style>
