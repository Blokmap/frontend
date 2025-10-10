<script setup lang="ts">
import DatePicker from 'primevue/datepicker';

defineProps<{
    minDate?: Date;
    maxDate?: Date;
    hourFormat?: '12' | '24';
}>();

const time = defineModel<Date>({
    required: true,
});
</script>

<template>
    <DatePicker
        v-model="time"
        :min-date="minDate"
        :max-date="maxDate"
        :hour-format="hourFormat || '24'"
        show-time
        time-only
        class="w-full">
    </DatePicker>
</template>
