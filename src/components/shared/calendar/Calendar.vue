<script setup lang="ts">
import type { TimeSlot } from '@/types/schema/Reservation';
import { daysInRange, formatDayName, isToday, startOfWeek } from '@/utils/date/date';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
    defineProps<{
        currentWeek: Date;
        timeSlots?: TimeSlot<any>[];
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
}>();

const { locale } = useI18n();

const updateInterval = ref<number>(0);
const currentTime = ref(new Date());
const calendarBodyRef = ref<HTMLElement>();

const weekStart = computed(() => startOfWeek(props.currentWeek));

const weekDays = computed(() => {
    const start = weekStart.value;
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return daysInRange(start, end);
});

const hourlyTimePeriods = computed(() => {
    const periods: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 60) {
            const formatted = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            periods.push(formatted);
        }
    }
    return periods;
});

const currentTimePosition = computed(() => {
    const now = currentTime.value;
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return (totalMinutes / (24 * 60)) * 100;
});

const isDayDisabled = (day: Date): boolean => {
    if (props.minDate && day < props.minDate) return true;
    if (props.maxDate && day > props.maxDate) return true;
    return false;
};

onMounted(() => {
    updateInterval.value = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    setTimeout(scrollToCurrentTime, 100);
});

onUnmounted(() => {
    if (updateInterval.value) {
        clearInterval(updateInterval.value);
    }
});

function getDayTimeSlots(day: Date): TimeSlot<any>[] {
    return props.timeSlots.filter((slot) => slot.day.toDateString() === day.toDateString());
}

function getSlotPosition(slot: TimeSlot<any>): { top: string; height: string } {
    // Parse AM/PM time format to 24-hour for calculations
    function parseTimeString(timeStr: string): { hour: number; minute: number } {
        // Check if it's AM/PM format
        if (timeStr.includes('AM') || timeStr.includes('PM')) {
            const isPM = timeStr.includes('PM');
            const cleanTime = timeStr.replace(/\s*(AM|PM)/i, '');
            const [hourStr, minuteStr] = cleanTime.split(':');
            let hour = parseInt(hourStr);
            const minute = parseInt(minuteStr);

            // Convert to 24-hour format
            if (isPM && hour !== 12) {
                hour += 12;
            } else if (!isPM && hour === 12) {
                hour = 0;
            }

            return { hour, minute };
        } else {
            // Assume 24-hour format
            const [hour, minute] = timeStr.split(':').map(Number);
            return { hour, minute };
        }
    }

    const startParsed = parseTimeString(slot.startTime);
    const endParsed = parseTimeString(slot.endTime);

    const startMinutes = startParsed.hour * 60 + startParsed.minute;
    const endMinutes = endParsed.hour * 60 + endParsed.minute;
    const durationMinutes = endMinutes - startMinutes;

    // Each hour is 50px (as defined in .time-period-cell height)
    const pixelsPerHour = 50;
    const pixelsPerMinute = pixelsPerHour / 60;

    const topPosition = startMinutes * pixelsPerMinute;
    const height = durationMinutes * pixelsPerMinute;

    return {
        top: `${topPosition}px`,
        height: `${Math.max(height, 20)}px`, // Minimum height of 20px for visibility
    };
}

function scrollToCurrentTime(): void {
    if (!calendarBodyRef.value) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const timePeriodHeight = 50;
    const scrollPosition = (currentMinutes / 60) * timePeriodHeight;
    const offset = timePeriodHeight * 2;

    calendarBodyRef.value.scrollTo({
        top: Math.max(0, scrollPosition - offset),
        behavior: 'smooth',
    });
}

function handleTimePeriodClick(day: Date, time: string): void {
    if (props.minDate && day < props.minDate) return;
    if (props.maxDate && day > props.maxDate) return;

    emit('click:time-slot', { day, time });
}

function handleDayClick(day: Date): void {
    emit('click:day', day);
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
                                <div class="custom-time-slot" :style="getSlotPosition(slot)">
                                    <slot name="time-slot" :slot="slot"> </slot>
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
        height: 50px;

        @media (max-width: 768px) {
            @apply p-1 pr-2;
            @apply text-xs;
            height: 40px;
        }
    }
}

.day-column {
    @apply relative;
    @apply border-r border-gray-200 last:border-r-0;
    min-width: 120px;

    @media (max-width: 768px) {
        min-width: 100px;
    }

    .time-period-cell {
        @apply relative h-[50px] cursor-pointer;
        @apply border-b border-gray-100;
        @apply hover:bg-primary-50 transition-colors;

        @media (max-width: 768px) {
            @apply h-[40px];
        }

        &:hover::before {
            @apply pointer-events-none absolute inset-0;
        }

        &.disabled {
            @apply cursor-not-allowed bg-gray-200 opacity-40;
            position: relative;

            &:hover {
                @apply bg-gray-200;
            }

            /* Add diagonal stripes pattern for disabled dates */
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-image: repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(156, 163, 175, 0.3) 2px,
                    rgba(156, 163, 175, 0.3) 4px
                );
                pointer-events: none;
            }
        }
    }
}

.custom-time-slot {
    @apply absolute right-0 left-0 z-10 min-h-[20px];
    overflow: visible;
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
