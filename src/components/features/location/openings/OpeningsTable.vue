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
    currentWeek?: Date;
    isLoading?: boolean;
}>();

const weekDays = computed(() => {
    const days = [];
    const referenceDate = props.currentWeek || new Date();
    const current = startOfWeek(referenceDate);
    const weekEnd = endOfWeek(referenceDate);

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
        <!-- Loading State -->
        <template v-if="isLoading">
            <div class="openings-table">
                <div v-for="n in 7" :key="n" class="table-row-skeleton">
                    <div class="flex-1 px-4 py-2.5">
                        <div class="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                    </div>
                    <div class="flex-1 px-4 py-2.5 text-right">
                        <div class="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Opening Hours Table -->
        <template v-else-if="openingTimes && openingTimes.length > 0">
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
                    Geen openingstijden beschikbaar voor deze week
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

.table-row-skeleton {
    @apply relative flex items-center border-b border-gray-200 bg-white text-sm;

    &::after {
        @apply absolute top-0 bottom-0 left-1/2 border-l border-gray-200 content-[''];
    }
}
</style>
