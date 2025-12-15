<script setup lang="ts" generic="T = any">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { PIXELS_PER_HOUR } from '@/domain/calendar';
import {
    addToDate,
    datesInRange,
    formatDayName,
    isSameDay,
    isToday,
    startOfWeek,
} from '@/utils/date';
import { addToTime, createTime, timeToMinutes } from '@/utils/time';
import type { TimeSlot, TimeCell } from '@/domain/calendar';

const props = withDefaults(
    defineProps<{
        currentWeek: Date;
        timeSlots?: TimeSlot<T>[];
        minDate?: Date;
        maxDate?: Date;
    }>(),
    {
        timeSlots: () => [],
    },
);

const emit = defineEmits<{
    'click:cell': [timeCell: TimeCell];
    'click:day': [day: Date];
}>();

const { locale } = useI18n();

const currentTime = ref(new Date());
const calendarBodyRef = useTemplateRef<HTMLElement>('calendarBodyRef');

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

/**
 * Check if a day is disabled based on minDate and maxDate props
 *
 * @param day - The date to check
 */
function isDayDisabled(day: Date): boolean {
    if (props.minDate && day < props.minDate) return true;
    if (props.maxDate && day > props.maxDate) return true;
    return false;
}

/**
 * Get all time slots for a specific day
 *
 * @param day - The date to get time slots for
 */
function getDayTimeSlots(day: Date): TimeSlot<T>[] {
    return props.timeSlots.filter((slot) => isSameDay(slot.day, day));
}

/**
 * Get the position (top and height) of a time slot in pixels
 *
 * @param slot - The time slot to calculate position for
 * @return An object with top and height in pixels
 */
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

/**
 * Handle click on a calendar cell
 *
 * @param day - The day of the cell clicked
 * @param hour - The hour of the cell clicked
 */
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

/**
 * Handle click on a day header
 *
 * @param day - The date clicked
 */
function onDayClick(day: Date): void {
    emit('click:day', day);
}

/**
 * Scroll the calendar to show the current time
 */
function scrollToCurrentTime(): void {
    if (!calendarBodyRef.value) return;

    const scrollPosition = (currentTimePosition.value / 100) * (24 * PIXELS_PER_HOUR);
    const viewportHeight = calendarBodyRef.value.clientHeight;
    const centeredScrollPosition = scrollPosition - viewportHeight / 2;

    calendarBodyRef.value.scrollTo({
        top: Math.max(0, centeredScrollPosition),
        behavior: 'smooth',
    });
}

onMounted(() => {
    // Scroll to current time on mount
    scrollToCurrentTime();

    // Update current time every minute to move the indicator
    const updateInterval = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    // Cleanup on unmount
    onUnmounted(() => clearInterval(updateInterval));
});
</script>

<template>
    <div class="calendar">
        <!-- Calendar body -->
        <div ref="calendarBodyRef" class="calendar__body">
            <!-- Header with days -->
            <div class="calendar__header">
                <!-- Empty corner for time column -->
                <div class="calendar__header-col"></div>

                <!-- Day headers -->
                <div
                    v-for="(day, index) in weekDays"
                    :key="index"
                    :class="[
                        'calendar__header-col',
                        { 'calendar__header-col--today': isToday(day) },
                    ]"
                    @click="onDayClick(day)">
                    <div class="text-sm font-medium md:text-xs">
                        {{ formatDayName(day, 'short', locale) }}
                    </div>
                    <div
                        class="mt-1 text-sm font-semibold md:text-base"
                        :class="{ 'calendar__today-badge': isToday(day) }">
                        {{ day.getDate() }}
                    </div>
                </div>
            </div>

            <!-- Calendar grid -->
            <div ref="calendarGridRef" class="calendar__grid">
                <!-- Time column -->
                <div class="calendar__time-col">
                    <div
                        v-for="hour in 23"
                        :key="hour"
                        class="calendar__time-label"
                        :style="{ top: `${hour * PIXELS_PER_HOUR}px` }">
                        {{ hour.toString().padStart(2, '0') }}:00
                    </div>
                </div>

                <!-- Day columns -->
                <div v-for="(day, dayIndex) in weekDays" :key="dayIndex" class="calendar__day-col">
                    <!-- Day cells grid for each day -->
                    <div
                        v-for="hour in 24"
                        :key="hour"
                        :class="[
                            'calendar__cell',
                            { 'calendar__cell--disabled': isDayDisabled(day) },
                        ]"
                        :style="{ height: PIXELS_PER_HOUR + 'px' }"
                        @click="onCellClick(day, hour - 1)"></div>

                    <!-- Custom time slots positioned absolutely within the day -->
                    <template v-for="slot in getDayTimeSlots(day)" :key="slot.metadata?.toString()">
                        <div class="calendar__slot" :style="getSlotPosition(slot)">
                            <slot :slot="slot" name="time-slot"></slot>
                        </div>
                    </template>

                    <!-- Current time indicator for today -->
                    <div
                        v-if="isToday(day)"
                        class="calendar__now-indicator"
                        :style="{ top: `${currentTimePosition}%` }">
                        <div class="calendar__now-line">
                            <div class="calendar__now-dot"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar {
    @apply flex max-h-[80vh] min-h-[500px] w-full flex-col;
    @apply rounded-lg bg-white shadow-md;
    @apply overflow-hidden;
}

.calendar__header {
    @apply sticky top-0 z-30;
    @apply grid bg-white;
    @apply min-w-max md:w-full md:min-w-0;
    @apply grid-cols-[50px_repeat(7,1fr)];

    .calendar__header-col {
        @apply border-r border-b border-slate-100 last:border-r-0 first-of-type:border-b-0;
        @apply text-xs;

        &:not(:first-child) {
            @apply cursor-pointer py-3 text-center;
            @apply transition-colors hover:bg-slate-100;
        }
    }

    .calendar__header-col--today {
        @apply bg-secondary-50 hover:!bg-secondary-100 text-secondary-500;
    }

    .calendar__today-badge {
        @apply mx-auto flex h-6 w-6 md:h-5 md:w-5;
        @apply items-center justify-center;
        @apply bg-secondary-500 rounded-full text-white;
    }
}

.calendar__body {
    @apply relative flex-1 overflow-auto;

    &::-webkit-scrollbar {
        @apply h-2 w-2;
    }

    &::-webkit-scrollbar-track {
        @apply bg-slate-100;
    }

    &::-webkit-scrollbar-thumb {
        @apply rounded bg-slate-300 hover:bg-slate-400;
    }
}

.calendar__grid {
    @apply relative grid grid-cols-[50px_repeat(7,1fr)];
    @apply w-full min-w-max md:min-w-0;
}

.calendar__time-col {
    @apply sticky left-0 z-40;
    @apply relative border-r border-slate-100;
}

.calendar__time-label {
    @apply absolute right-0 left-0 -translate-y-[50%];
    @apply pr-2 text-right text-[12px] text-slate-600 md:pr-1;
}

.calendar__day-col {
    @apply relative;
    @apply border-r border-slate-100 last:border-r-0;

    &::before {
        @apply pointer-events-none absolute inset-0;
        @apply content-[''];
    }
}

.calendar__cell {
    @apply relative cursor-pointer;
    @apply border-b border-slate-100 hover:bg-slate-100;
    @apply transition-colors;
}

.calendar__cell--disabled {
    @apply cursor-not-allowed bg-slate-100 opacity-40;
    @apply hover:bg-slate-100;
}

.calendar__slot {
    @apply absolute right-0 left-0 z-10 min-h-[20px];
    @apply p-1;
    @apply pointer-events-none overflow-visible select-none;
}

.calendar__slot :deep(> *) {
    @apply pointer-events-auto;
}

.calendar__now-indicator {
    @apply pointer-events-none absolute right-0 left-0 z-20;
}

.calendar__now-line {
    @apply flex items-center;
}

.calendar__now-line::after {
    content: '';
    @apply h-0.5 flex-1 bg-red-500;
}

.calendar__now-dot {
    @apply -ml-1 h-2 w-2 rounded-full bg-red-500;
}
</style>
