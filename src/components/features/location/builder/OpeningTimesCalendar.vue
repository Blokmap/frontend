<script setup lang="ts">
import type { CalendarTimeSlot } from '@/components/shared/calendar/Calendar.vue';
import Calendar from '@/components/shared/calendar/Calendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { useVimControls } from '@/composables/useVimControls';
import type { OpeningTimeRequest, Time } from '@/domain/openingTime';
import { startOfWeek } from '@/utils/date/date';
import { timeToDate } from '@/utils/date/time';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    dateInWeek: Date;
    openingTimes: OpeningTimeRequest[];
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    'update:dateInWeek': [value: Date];
    'select:slot': [slot: { day: Date; time: string }];
    'edit:slot': [index: number, slot: OpeningTimeRequest];
    'delete:slot': [index: number];
    'drag:slot': [index: number, slot: OpeningTimeRequest];
}>();

const weekStart = computed(() => startOfWeek(props.dateInWeek));
const calendarTimeSlots = ref<CalendarTimeSlot<any>[]>([]);

function updateCalendarTimeSlots() {
    calendarTimeSlots.value = props.openingTimes.map((ot, index) => {
        const startTime = timeToDate(ot.startTime);
        const endTime = timeToDate(ot.endTime);

        return {
            id: `opening-time-${index}`,
            day: new Date(ot.day), // Use the day field instead of startTime
            startTime: ot.startTime, // Use the Time string directly
            endTime: ot.endTime, // Use the Time string directly
            duration: {
                hours: Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)),
                minutes: Math.floor(
                    ((endTime.getTime() - startTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60),
                ),
            },
            metadata: { openingTime: ot, index },
        };
    });
}

watch(() => props.openingTimes, updateCalendarTimeSlots, { immediate: true });

// Vim controls
useVimControls({
    previousWeek: { keys: ['j', 'ArrowLeft'], callback: goToPreviousWeek },
    nextWeek: { keys: ['k', 'ArrowRight'], callback: goToNextWeek },
    goToToday: { keys: ['t', 'Home'], callback: goToToday },
});

// Navigation functions
function goToPreviousWeek(): void {
    const newDate = new Date(weekStart.value);
    newDate.setDate(newDate.getDate() - 7);
    emit('update:dateInWeek', newDate);
}

function goToNextWeek(): void {
    const newDate = new Date(weekStart.value);
    newDate.setDate(newDate.getDate() + 7);
    emit('update:dateInWeek', newDate);
}

function goToToday(): void {
    emit('update:dateInWeek', new Date());
}

// Event handlers
function handleDateSelect(date: any): void {
    if (date instanceof Date) {
        emit('update:dateInWeek', date);
    }
}

function handleSlotClick(slot: { day: Date; time: string }): void {
    emit('select:slot', slot);
}

function handleEditSlot(slot: CalendarTimeSlot): void {
    if (slot.metadata) {
        emit('edit:slot', slot.metadata.index, slot.metadata.openingTime);
    }
}

function handleDeleteSlot(slot: CalendarTimeSlot): void {
    if (slot.metadata) {
        emit('delete:slot', slot.metadata.index);
    }
}

function handleDragSlot(
    slot: CalendarTimeSlot,
    newStartTime: string,
    newEndTime: string,
    newDay?: Date,
): void {
    if (!slot.metadata) return;

    // Ensure the time strings are in the correct HH:mm format
    const startTime = newStartTime.includes(':')
        ? (newStartTime as Time)
        : (`${newStartTime}:00` as Time);
    const endTime = newEndTime.includes(':') ? (newEndTime as Time) : (`${newEndTime}:00` as Time);

    const updatedOpeningTime: OpeningTimeRequest = {
        ...slot.metadata.openingTime,
        startTime,
        endTime,
        day: newDay || new Date(slot.metadata.openingTime.day), // Use the day field
    };

    emit('drag:slot', slot.metadata.index, updatedOpeningTime);
}
</script>

<template>
    <div class="flex h-full flex-col space-y-6">
        <CalendarControls
            :current-week="dateInWeek"
            :min-date="minDate"
            :max-date="maxDate"
            @click:previous-week="goToPreviousWeek"
            @click:next-week="goToNextWeek"
            @click:current-week="goToToday"
            @select:date="handleDateSelect">
        </CalendarControls>

        <div class="flex-1 overflow-hidden">
            <Calendar
                :current-week="dateInWeek"
                :time-slots="calendarTimeSlots"
                :min-date="minDate"
                :max-date="maxDate"
                :on-previous-week="goToPreviousWeek"
                :on-next-week="goToNextWeek"
                @click:time-slot="handleSlotClick"
                @drag:slot="handleDragSlot"
                class="h-full">
                <template #time-slot="{ slot }">
                    <div class="opening-time-card" @click="handleEditSlot(slot)">
                        <div class="time-display">
                            <span class="time-text">{{ slot.startTime }}-{{ slot.endTime }}</span>
                        </div>
                    </div>
                </template>
            </Calendar>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.opening-time-card {
    @apply bg-primary-100 relative h-full;
    @apply flex justify-center;
    @apply p-2;
    @apply cursor-pointer;
    @apply border-2 border-transparent;

    &:hover {
        @apply border-primary-500;
    }
}

.time-display {
    @apply text-primary-700 flex items-center justify-center text-center;

    .time-text {
        @apply text-xs font-semibold;
    }
}
</style>
