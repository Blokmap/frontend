<script setup lang="ts">
import OpeningTimeslot from '@/components/features/openings/timeslots/OpeningTimeslot.vue';
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import { computed } from 'vue';
import { openingRequestsToTimeSlots, type TimeCell, type TimeSlot } from '@/domain/calendar';
import type { OpeningTimeBody } from '@/domain/openings';

const props = defineProps<{
    openingTimes: OpeningTimeBody[];
    inWeekOf: Date;
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    'click:cell': [timeCell: TimeCell];
    'click:slot': [slot: TimeSlot<OpeningTimeBody>];
    'drag:slot': [slot: TimeSlot<OpeningTimeBody>, newSlot: TimeSlot];
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
function onSlotClick(slot: TimeSlot<OpeningTimeBody>): void {
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
