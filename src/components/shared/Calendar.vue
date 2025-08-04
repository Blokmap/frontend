<script setup lang="ts">
import type { TimeSlot } from '@/types/schema/Reservation';
import {
    daysInRange,
    formatDayName,
    formatTimeFromHoursAndMinutes,
    isToday,
    startOfWeek,
} from '@/utils/date';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
    defineProps<{
        currentWeek?: Date;
        timeSlots?: TimeSlot[];
        timeInterval?: number;
    }>(),
    {
        currentWeek: () => new Date(),
        timeSlots: () => [],
        timeInterval: 60,
    },
);

const emit = defineEmits<{
    'click:time-slot': [slot: { day: Date; time: string }];
    'click:day': [day: Date];
}>();

const { locale } = useI18n();

const currentTime = ref(new Date());
const calendarBodyRef = ref<HTMLElement>();

let updateInterval: number;

const weekStart = computed(() => startOfWeek(props.currentWeek));

const weekDays = computed(() => {
    const start = weekStart.value;
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return daysInRange(start, end);
});

const hourlyTimeSlots = computed(() => {
    const slots: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += props.timeInterval) {
            slots.push(formatTimeFromHoursAndMinutes(hour, minute));
        }
    }
    return slots;
});

const currentTimePosition = computed(() => {
    const now = currentTime.value;
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return (totalMinutes / (24 * 60)) * 100;
});

function getDayTimeSlots(day: Date): TimeSlot[] {
    return props.timeSlots.filter((slot) => slot.day.toDateString() === day.toDateString());
}

function getSlotPosition(slot: TimeSlot): { top: string; height: string } {
    const [startHour, startMinute] = slot.startTime.split(':').map(Number);
    const [endHour, endMinute] = slot.endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;
    const totalMinutes = 24 * 60;

    return {
        top: `${(startMinutes / totalMinutes) * 100}%`,
        height: `${((endMinutes - startMinutes) / totalMinutes) * 100}%`,
    };
}

function scrollToCurrentTime(): void {
    if (!calendarBodyRef.value) return;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const timeSlotHeight = 50;
    const scrollPosition = (currentMinutes / props.timeInterval) * timeSlotHeight;
    const offset = timeSlotHeight * 2;

    calendarBodyRef.value.scrollTo({
        top: Math.max(0, scrollPosition - offset),
        behavior: 'smooth',
    });
}

function handleTimeSlotClick(day: Date, time: string): void {
    emit('click:time-slot', { day, time });
}

function handleDayClick(day: Date): void {
    emit('click:day', day);
}

onMounted(() => {
    updateInterval = setInterval(() => {
        currentTime.value = new Date();
    }, 1000);

    setTimeout(scrollToCurrentTime, 100);
});

onUnmounted(() => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});
</script>

<template>
    <div class="calendar-container">
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
            <!-- Time slots grid -->
            <div class="time-slots-grid">
                <!-- Time column -->
                <div class="time-column">
                    <div v-for="time in hourlyTimeSlots" :key="time" class="time-slot">
                        {{ time }}
                    </div>
                </div>

                <!-- Day columns -->
                <div v-for="(day, dayIndex) in weekDays" :key="dayIndex" class="day-column">
                    <!-- Time slot grid for each day -->
                    <div
                        v-for="time in hourlyTimeSlots"
                        :key="time"
                        class="time-slot-cell"
                        @click="handleTimeSlotClick(day, time)"></div>

                    <!-- Custom time slots positioned absolutely within the day -->
                    <div
                        v-for="slot in getDayTimeSlots(day)"
                        :key="slot.id"
                        class="custom-time-slot"
                        :style="getSlotPosition(slot)">
                        <slot name="timeSlot" :slot="slot">
                            <div class="slot-content">
                                {{ slot.startTime }} - {{ slot.endTime }}
                            </div>
                        </slot>
                    </div>

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
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.calendar-container {
    @apply flex flex-col rounded-lg border border-gray-200 bg-white;
    min-height: 500px;
    max-height: 75vh;
    overflow: hidden;
}

.calendar-header {
    @apply sticky top-0 z-30 grid border-b border-gray-200 bg-gray-50;
    grid-template-columns: 80px repeat(7, minmax(120px, 1fr));

    @media (max-width: 768px) {
        grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
    }

    & > div {
        @apply border-r border-gray-200 p-3 last:border-r-0;

        &:not(:first-child) {
            @apply cursor-pointer text-center transition-colors hover:bg-gray-100;

            &.today {
                @apply bg-blue-50 text-blue-600;
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
    @apply mt-1 text-lg font-semibold;

    @media (max-width: 768px) {
        @apply text-base;
    }

    &.today-indicator {
        @apply mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white;

        @media (max-width: 768px) {
            @apply h-6 w-6 text-sm;
        }
    }
}

.calendar-body {
    @apply relative flex-1 overflow-auto;

    .time-slots-grid {
        @apply relative grid;
        grid-template-columns: 80px repeat(7, minmax(120px, 1fr));
        min-width: 920px;

        @media (max-width: 768px) {
            grid-template-columns: 60px repeat(7, minmax(100px, 1fr));
            min-width: 760px;
        }
    }

    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
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

.time-column {
    @apply sticky left-0 z-20 border-r border-gray-200 bg-gray-50;
    min-width: 80px;

    @media (max-width: 768px) {
        min-width: 60px;
    }

    .time-slot {
        @apply border-b border-gray-100 p-2 pr-3 text-right text-sm text-gray-600;
        height: 50px;

        @media (max-width: 768px) {
            @apply p-1 pr-2 text-xs;
            height: 40px;
        }
    }
}

.day-column {
    @apply relative border-r border-gray-200 last:border-r-0;
    min-width: 120px;

    @media (max-width: 768px) {
        min-width: 100px;
    }

    .time-slot-cell {
        @apply relative cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50;
        height: 50px;

        @media (max-width: 768px) {
            height: 40px;
        }

        &:hover::before {
            @apply pointer-events-none absolute inset-0;
            content: '';
            background-color: rgba(59, 130, 246, 0.1);
        }
    }
}

.custom-time-slot {
    @apply absolute right-1 left-1 z-10 overflow-hidden rounded border border-blue-300 bg-blue-200 px-2 py-1 text-xs;
    min-height: 20px;

    .slot-content {
        @apply font-medium;
    }
}

.current-time-indicator {
    @apply pointer-events-none absolute right-0 left-0 z-20;

    .time-line {
        @apply flex items-center;

        .time-dot {
            @apply -ml-1 h-2 w-2 rounded-full bg-red-500;
        }

        .time-line-bar {
            @apply h-0.5 flex-1 bg-red-500;
        }
    }
}
</style>
