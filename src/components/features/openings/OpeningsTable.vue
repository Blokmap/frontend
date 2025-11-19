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
            <div class="space-y-2">
                <div v-for="n in 7" :key="n" class="flex items-center justify-between py-2.5">
                    <div class="h-4 w-16 animate-pulse rounded bg-slate-200"></div>
                    <div class="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                </div>
            </div>
        </template>

        <!-- Opening Hours Table -->
        <template v-else-if="openingTimes && openingTimes.length > 0">
            <OpeningsTableDay
                v-for="day in weekDays"
                :key="day.toDateString()"
                :day="day"
                :opening-times-by-day="openingTimesByDay">
            </OpeningsTableDay>
        </template>

        <!-- No Hours Available -->
        <template v-else>
            <div class="flex flex-col items-center gap-3 rounded-lg bg-slate-50 py-8 text-center">
                <FontAwesomeIcon :icon="faClock" class="h-8 w-8 text-slate-400" />
                <div>
                    <p class="text-sm font-medium text-slate-700">
                        Geen openingstijden beschikbaar
                    </p>
                    <p class="mt-1 text-xs text-slate-500">
                        Vraag de beheerder om openingstijden toe te voegen
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped></style>
