<script setup lang="ts">
import Button from 'primevue/button';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { groupOpeningTimesByDay } from '@/domain/openings/helpers';
import { endOfWeek, startOfWeek } from '@/utils/date/date';
import OpeningsTableDay from './OpeningsTableDay.vue';
import type { OpeningTime } from '@/domain/openings';

const props = defineProps<{
    openingTimes?: OpeningTime[];
}>();

const weekDays = computed(() => {
    const days = [];
    const current = startOfWeek();
    const weekEnd = endOfWeek();

    while (current <= weekEnd) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
});

const openingTimesByDay = computed(() => {
    if (!props.openingTimes) return new Map();
    return groupOpeningTimesByDay(props.openingTimes);
});
</script>

<template>
    <div>
        <!-- Opening Hours Table -->
        <template v-if="openingTimes && openingTimes.length > 0">
            <div class="openings-table">
                <OpeningsTableDay
                    v-for="(day, index) in weekDays"
                    :key="day.toDateString()"
                    :day="day"
                    :opening-times-by-day="openingTimesByDay"
                    :is-last="index === weekDays.length - 1">
                </OpeningsTableDay>
            </div>
        </template>

        <!-- No Hours Available -->
        <template v-else>
            <div class="no-hours">
                <FontAwesomeIcon :icon="faClock" class="mb-2 h-6 w-6 text-gray-400" />
                <p class="mb-3 text-sm font-medium text-gray-600">
                    Geen openingstijden beschikbaar
                </p>
                <Button
                    link
                    size="small"
                    class="text-xs text-gray-500 underline hover:text-gray-700">
                    Vraag de beheerder om openingstijden toe te voegen
                </Button>
            </div>
        </template>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.openings-table {
    @apply border border-gray-200 bg-white text-sm;
}

.no-hours {
    @apply rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center;
}
</style>
