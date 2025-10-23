<script setup lang="ts">
import OpeningTimeslot from '@/components/features/openings/timeslots/OpeningTimeslot.vue';
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import { computed } from 'vue';
import { openingRequestsToTimeSlots, type TimeCell, type TimeSlot } from '@/domain/calendar';
import type { OpeningTimeRequest } from '@/domain/openings';
import type { Time } from '@/utils/time';

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
        :current-week="inWeekOf"
        :time-slots="timeSlots"
        :min-date="minDate"
        :max-date="maxDate"
        :enable-dragging="true"
        :time-interval="15"
        :min-slot-duration="15"
        @click:cell="onCellClick"
        @drag:slot="onSlotDrag">
        <template #time-slot="{ slot }">
            <OpeningTimeslot
                :start-time="slot.startTime"
                :end-time="slot.endTime"
                @click="onSlotClick(slot)" />
        </template>
    </Calendar>
</template>
