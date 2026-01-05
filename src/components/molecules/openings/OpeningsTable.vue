<script setup lang="ts">
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { groupOpeningTimesByDay } from '@/domain/openings/helpers';
import { endOfWeek, startOfWeek } from '@/utils/date';
import OpeningsTableDay from './OpeningsTableDay.vue';
import type { OpeningTime } from '@/domain/openings';

const props = defineProps<{
    openingTimes?: OpeningTime[];
    currentWeek?: Date;
    loading?: boolean;
}>();

const weekDays = computed<Date[]>(() => {
    const referenceDate = props.currentWeek || new Date();

    const current = startOfWeek(referenceDate);
    const weekEnd = endOfWeek(referenceDate);

    const days = [];
    while (current <= weekEnd) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
});

const openingTimesByDay = computed<Map<string, OpeningTime[]>>(() => {
    if (!props.openingTimes) {
        return new Map();
    }

    return groupOpeningTimesByDay(props.openingTimes);
});
</script>

<template>
    <div class="openings-table">
        <!-- Opening Hours Table -->
        <template v-if="loading || openingTimesByDay.size > 0">
            <OpeningsTableDay
                v-for="day in weekDays"
                :key="day.toDateString()"
                :day="day"
                :loading="loading"
                :openings="openingTimesByDay.get(day.toDateString())">
            </OpeningsTableDay>
        </template>

        <!-- No Hours Available -->
        <template v-else>
            <div class="openings-table__empty">
                <FontAwesomeIcon :icon="faClock" class="openings-table__empty-icon" />
                <div>
                    <p class="openings-table__empty-title">Geen openingstijden beschikbaar</p>
                    <p class="openings-table__empty-subtitle">
                        Vraag de beheerder om openingstijden toe te voegen
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.openings-table {
    @apply w-full;
}

.openings-table__loading {
    @apply space-y-0 divide-y divide-slate-200;
}

.openings-table__loading-item {
    @apply flex items-center justify-between py-2.5;
}

.openings-table__empty {
    @apply flex flex-col items-center gap-3 border-2 border-dashed border-slate-200 py-8 text-center;
}

.openings-table__empty-icon {
    @apply h-8 w-8 text-slate-400;
}

.openings-table__empty-title {
    @apply text-sm font-medium text-slate-700;
}

.openings-table__empty-subtitle {
    @apply mt-1 text-xs text-slate-500;
}
</style>
