<script setup lang="ts" generic="T = any">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { PIXELS_PER_HOUR } from '@/domain/openings';
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

onMounted(() => {
    // Update current time every minute to move the indicator
    const updateInterval = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    // Cleanup on unmount
    onUnmounted(() => clearInterval(updateInterval));
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
                            <div class="custom-time-slot" :style="getSlotPosition(slot)">
                                <slot :slot="slot" name="time-slot"></slot>
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
    @apply flex max-h-[80vh] min-h-[500px] flex-col;
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
    @apply min-w-[920px];
    grid-template-columns: 80px repeat(7, minmax(120px, 1fr));

    @media (max-width: 768px) {
        @apply min-w-[760px];
        grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
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
    @apply p-1 transition-all duration-150 ease-out;
    @apply pointer-events-none overflow-visible select-none;

    :deep(> *) {
        @apply pointer-events-auto;
    }
}
</style>
