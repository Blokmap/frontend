<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { computed } from 'vue';
import { RESERVATION_BLOCK_SIZE_MINUTES } from '@/domain/reservation/reservationConstants';
import { dateToTime, timeToDate } from '@/utils/time';
import type { Time } from '@/utils/time';

const props = withDefaults(
    defineProps<{
        minTime?: Time;
        maxTime?: Time;
        hourFormat?: '12' | '24';
        stepMinutes?: number;
    }>(),
    {
        hourFormat: '24',
        stepMinutes: RESERVATION_BLOCK_SIZE_MINUTES,
    },
);

const time = defineModel<Time>({
    required: true,
});

// Convert Time to Date for DatePicker
const dateValue = computed({
    get: () => timeToDate(time.value),
    set: (date: Date) => {
        time.value = dateToTime(date);
    },
});

// Convert min/max Time to Date for DatePicker
const minDate = computed(() => (props.minTime ? timeToDate(props.minTime) : undefined));
const maxDate = computed(() => (props.maxTime ? timeToDate(props.maxTime) : undefined));
</script>

<template>
    <DatePicker
        v-model="dateValue"
        :min-date="minDate"
        :max-date="maxDate"
        :hour-format="hourFormat"
        :step-minute="stepMinutes"
        show-time
        time-only
        class="w-full">
    </DatePicker>
</template>
