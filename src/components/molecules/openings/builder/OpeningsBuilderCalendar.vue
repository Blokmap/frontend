<script setup lang="ts">
import Calendar from '@/components/molecules/calendar/Calendar.vue';
import OpeningTimeslot from '@/components/molecules/openings/timeslots/OpeningTimeslot.vue';
import { computed } from 'vue';
import { openingRequestsToTimeSlots, type TimeCell, type TimeSlot } from '@/domain/calendar';
import type { OpeningTimeRequest } from '@/domain/openings';

const props = defineProps<{
    openingTimes: OpeningTimeRequest[];
    inWeekOf: Date;
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    'click:cell': [timeCell: TimeCell];
    'click:slot': [slot: TimeSlot<OpeningTimeRequest>];
    'drag:slot': [slot: TimeSlot<OpeningTimeRequest>, newSlot: TimeSlot];
}>();

const timeSlots = computed(() => openingRequestsToTimeSlots(props.openingTimes));

/**
 * Handle cell click event.
 * @param timeCell - Time cell data
 */
function onCellClick(timeCell: TimeCell): void {
    emit('click:cell', timeCell);
}

/**
 * Handle slot click event.
 * @param slot - Time slot data
 */
function onSlotClick(slot: TimeSlot<OpeningTimeRequest>): void {
    emit('click:slot', slot);
}
</script>

<template>
    <Calendar
        :current-week="inWeekOf"
        :time-slots="timeSlots"
        :min-date="minDate"
        :max-date="maxDate"
        :enable-dragging="true"
        :time-interval="15"
        :min-slot-duration="15"
        @click:cell="onCellClick">
        <template #time-slot="{ slot }">
            <OpeningTimeslot
                :start-time="slot.startTime"
                :end-time="slot.endTime"
                @click="onSlotClick(slot)">
            </OpeningTimeslot>
        </template>
    </Calendar>
</template>
