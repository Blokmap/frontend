<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { dateToTime, timeToDate } from '@/utils/time';
import type { Time } from '@/utils/time';

const props = withDefaults(
    defineProps<{
        minTime?: Time;
        maxTime?: Time;
        hourFormat?: '12' | '24';
        stepMinutes?: number;
        placeholder?: string;
        showClear?: boolean;
    }>(),
    {
        hourFormat: '24',
        showClear: false,
    },
);

const time = defineModel<Time | null>({
    default: null,
});

// Convert Time to Date for DatePicker
const dateValue = computed({
    get: () => (time.value ? timeToDate(time.value) : null),
    set: (date: Date | null) => {
        time.value = date ? dateToTime(date) : null;
    },
});

// Convert min/max Time to Date for DatePicker
const minDate = computed(() => (props.minTime ? timeToDate(props.minTime) : undefined));
const maxDate = computed(() => (props.maxTime ? timeToDate(props.maxTime) : undefined));
</script>

<template>
    <div class="time-input">
        <DatePicker
            v-model="dateValue"
            :min-date="minDate"
            :max-date="maxDate"
            :hour-format="hourFormat"
            :step-minute="stepMinutes"
            :placeholder="placeholder"
            show-time
            time-only
            class="w-full">
        </DatePicker>
        <button
            v-if="time && showClear"
            @click.stop="time = null"
            type="button"
            class="time-input__clear">
            <FontAwesomeIcon :icon="faX" />
        </button>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.time-input {
    @apply relative;

    .time-input__clear {
        @apply absolute top-1/2 right-2 -translate-y-1/2;
        @apply text-slate-400 hover:text-slate-600;
        @apply text-xs leading-none;
    }
}
</style>
