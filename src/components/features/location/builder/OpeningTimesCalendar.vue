<script setup lang="ts">
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import { computed } from 'vue';
import { openingsToTimeslots, type TimeCell, type TimeSlot } from '@/domain/calendar';
import { timeToString } from '@/utils/time';
import type { OpeningTimeRequest } from '@/domain/openings';
import type { Time } from '@/utils/time';

const props = defineProps<{
    openingTimes: OpeningTimeRequest[];
    dateInWeek: Date;
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    'click:cell': [timeCell: TimeCell];
    'click:slot': [slot: TimeSlot<OpeningTimeRequest>];
    'drag:slot': [slot: TimeSlot<OpeningTimeRequest>, newSlot: TimeSlot];
}>();

const timeSlots = computed(() => openingsToTimeslots(props.openingTimes));

function onCellClick(timeCell: TimeCell): void {
    emit('click:cell', timeCell);
}

function onSlotClick(slot: TimeSlot<OpeningTimeRequest>): void {
    emit('click:slot', slot);
}

function onSlotDrag(
    slot: TimeSlot<OpeningTimeRequest>,
    newStartTime: Time,
    newEndTime: Time,
    newDay: Date,
): void {
    if (!slot.metadata) return;

    emit('drag:slot', slot, {
        metadata: slot.metadata,
        startTime: newStartTime,
        endTime: newEndTime,
        day: newDay,
    });
}
</script>

<template>
    <Calendar
        :current-week="dateInWeek"
        :time-slots="timeSlots"
        :min-date="minDate"
        :max-date="maxDate"
        :enable-dragging="true"
        :time-interval="15"
        :min-slot-duration="15"
        @click:cell="onCellClick"
        @drag:slot="onSlotDrag">
        <template #time-slot="{ slot }">
            <div class="opening-time-card" @click="onSlotClick(slot)">
                <div class="time-display">
                    <span class="time-text">
                        {{ timeToString(slot.startTime) }}-{{ timeToString(slot.endTime) }}
                    </span>
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
    @apply border-1 border-transparent;

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
