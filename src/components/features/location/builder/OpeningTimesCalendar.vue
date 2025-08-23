<script setup lang="ts">
import Calendar from '@/components/shared/calendar/Calendar.vue';
import type { OpeningTimeRequest } from '@/domain/openingTime';
import { openingTimesToTimeSlots } from '@/domain/openingTime';
import type { CalendarTimeSlot } from '@/types/Calendar';
import { startOfWeek } from '@/utils/date/date';
import type { Time } from '@/utils/date/time';
import { computed } from 'vue';

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
const calendarTimeSlots = computed(() => openingTimesToTimeSlots(props.openingTimes));

// Event handlers
function handleSlotClick(slot: { day: Date; time: string }): void {
    emit('select:slot', slot);
}

function handleEditSlot(slot: CalendarTimeSlot): void {
    if (slot.metadata) {
        emit('edit:slot', slot.metadata.index, slot.metadata.openingTime);
    }
}

function handleDragSlot(
    slot: CalendarTimeSlot,
    newStartTime: Time,
    newEndTime: Time,
    newDay?: Date,
): void {
    if (!slot.metadata) return;

    const day = newDay || new Date(slot.metadata.openingTime.day);

    emit('drag:slot', slot.metadata.index, {
        ...slot.metadata.openingTime,
        startTime: newStartTime,
        endTime: newEndTime,
        day,
    });
}
</script>

<template>
    <Calendar
        :current-week="dateInWeek"
        :time-slots="calendarTimeSlots"
        :min-date="minDate"
        :max-date="maxDate"
        :enable-dragging="true"
        :time-interval="15"
        :min-slot-duration="15"
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
