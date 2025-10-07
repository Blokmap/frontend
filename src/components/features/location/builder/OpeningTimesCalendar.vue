<script setup lang="ts">
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import { computed } from 'vue';
import { openingTimesToTimeSlots } from '@/domain/openings';
import { timeToString } from '@/utils/time';
import type { TimeCell, TimeSlot } from '@/domain/calendar';
import type { OpeningTimeRequest } from '@/domain/openings';
import type { Time } from '@/utils/time';

const props = defineProps<{
    dateInWeek: Date;
    openingTimes: OpeningTimeRequest[];
    minDate?: Date;
    maxDate?: Date;
}>();

const emit = defineEmits<{
    'update:dateInWeek': [value: Date];
    'click:cell': [timeCell: TimeCell];
    'click:slot': [index: number, slot: OpeningTimeRequest];
    'drag:slot': [index: number, slot: OpeningTimeRequest];
}>();

const timeSlots = computed(() => openingTimesToTimeSlots(props.openingTimes));

function onCellClick(timeCell: TimeCell): void {
    emit('click:cell', timeCell);
}

function onSlotClick(slot: TimeSlot): void {
    if (slot.metadata) {
        emit('click:slot', slot.metadata.index, slot.metadata.openingTime);
    }
}

function onSlotDrag(slot: TimeSlot, newStartTime: Time, newEndTime: Time, newDay?: Date): void {
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
