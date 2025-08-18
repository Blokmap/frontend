<script setup lang="ts">
import Calendar from '@/components/shared/calendar/Calendar.vue';
import CalendarControls from '@/components/shared/calendar/CalendarControls.vue';
import { useVimControls } from '@/composables/useVimControls';
import type { CreateOpeningTimeRequest } from '@/types/schema/Location';
import type { TimeSlot } from '@/types/schema/Reservation';
import { endOfWeek, startOfWeek } from '@/utils/date/date';
import { computed } from 'vue';

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
}>();

const weekStart = computed(() => startOfWeek(props.dateInWeek));
const weekEnd = computed(() => endOfWeek(props.dateInWeek));

// Convert opening times to time slots for calendar display
const calendarTimeSlots = computed(() => {
    return props.openingTimes.map((ot, index) => {
        const startTime = new Date(ot.startTime);
        const endTime = new Date(ot.endTime);
        const duration = {
            hours: Math.floor((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)),
            minutes: Math.floor(
                ((endTime.getTime() - startTime.getTime()) % (1000 * 60 * 60)) / (1000 * 60),
            ),
        };

        return {
            id: `opening-time-${index}`,
            day: new Date(ot.startTime),
            startTime: startTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }),
            endTime: endTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            }),
            duration,
            metadata: {
                openingTime: ot,
                index,
            },
        };
    });
});

// Vim controls for calendar navigation
useVimControls({
    previousWeek: {
        keys: ['j', 'ArrowLeft'],
        callback: goToPreviousWeek,
    },
    nextWeek: {
        keys: ['k', 'ArrowRight'],
        callback: goToNextWeek,
    },
    goToToday: {
        keys: ['t', 'Home'],
        callback: goToToday,
    },
});

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

function handleDateSelect(date: any): void {
    if (date && date instanceof Date) {
        emit('update:dateInWeek', date);
    }
}

function handleSlotClick(slot: { day: Date; time: string }): void {
    emit('select:slot', slot);
}

function handleEditSlot(slot: TimeSlot): void {
    const openingTimeSlot = slot;
    if (openingTimeSlot.metadata) {
        emit('edit:slot', openingTimeSlot.metadata.index, openingTimeSlot.metadata.openingTime);
    }
}

function handleDeleteSlot(slot: TimeSlot): void {
    const openingTimeSlot = slot;
    if (openingTimeSlot.metadata) {
        emit('delete:slot', openingTimeSlot.metadata.index);
    }
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
