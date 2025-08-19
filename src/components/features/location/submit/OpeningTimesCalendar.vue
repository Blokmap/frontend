<script setup lang="ts">
import Calendar from '@/components/shared/calendar/Calendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { useVimControls } from '@/composables/useVimControls';
import type { CreateOpeningTimeRequest } from '@/types/schema/Location';
import type { TimeSlot } from '@/types/schema/Reservation';
import { startOfWeek } from '@/utils/date/date';
import { computed, ref, watch } from 'vue';

const props = defineProps<{
    dateInWeek: Date;
    openingTimes: CreateOpeningTimeRequest[];
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    'update:dateInWeek': [value: Date];
    'select:slot': [slot: { day: Date; time: string }];
    'edit:slot': [index: number, slot: CreateOpeningTimeRequest];
    'delete:slot': [index: number];
    'drag:slot': [index: number, slot: CreateOpeningTimeRequest];
}>();

const weekStart = computed(() => startOfWeek(props.dateInWeek));
const calendarTimeSlots = ref<TimeSlot<any>[]>([]);

// Convert opening times to calendar time slots
function updateCalendarTimeSlots() {
    calendarTimeSlots.value = props.openingTimes.map((ot, index) => {
        const startTime = new Date(ot.startTime);
        const endTime = new Date(ot.endTime);

        return {
            id: `opening-time-${index}`,
            day: new Date(ot.startTime),
            startTime: startTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),
            endTime: endTime.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            }),
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

function handleEditSlot(slot: TimeSlot): void {
    if (slot.metadata) {
        emit('edit:slot', slot.metadata.index, slot.metadata.openingTime);
    }
}

function handleDeleteSlot(slot: TimeSlot): void {
    if (slot.metadata) {
        emit('delete:slot', slot.metadata.index);
    }
}

function handleDragSlot(
    slot: TimeSlot,
    newStartTime: string,
    newEndTime: string,
    newDay?: Date,
): void {
    if (!slot.metadata) return;

    const [startHours, startMinutes] = newStartTime.split(':').map(Number);
    const [endHours, endMinutes] = newEndTime.split(':').map(Number);

    const baseDate = newDay || new Date(slot.metadata.openingTime.startTime);
    const startDate = new Date(baseDate);
    const endDate = new Date(baseDate);

    startDate.setHours(startHours, startMinutes, 0, 0);
    endDate.setHours(endHours, endMinutes, 0, 0);

    const updatedOpeningTime: CreateOpeningTimeRequest = {
        ...slot.metadata.openingTime,
        startTime: startDate,
        endTime: endDate,
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
