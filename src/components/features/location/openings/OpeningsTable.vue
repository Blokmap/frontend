<script setup lang="ts">
import type { OpeningTime } from '@/domain/openings';
import {
    formatOpeningTimeRange,
    getOpeningTimesForDay,
    groupOpeningTimesByDay,
} from '@/domain/openings/helpers';
import { endOfWeek, formatDayName, isToday, startOfWeek } from '@/utils/date/date';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    openingTimes?: OpeningTime[];
    compact?: boolean;
}>();

const { locale } = useI18n();

// Get the current week's start and end dates
const now = new Date();
const weekStart = startOfWeek(now);
const weekEnd = endOfWeek(now);

// Create an array of days for the current week
const weekDays = computed(() => {
    const days = [];
    const current = new Date(weekStart);

    while (current <= weekEnd) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return days;
});

// Group opening times by day of the week
const openingTimesByDay = computed(() => {
    if (!props.openingTimes) return new Map();
    return groupOpeningTimesByDay(props.openingTimes);
});

// Get opening times for a specific day (wrapper for template usage)
function getOpeningTimesForDayWrapper(day: Date): OpeningTime[] {
    return getOpeningTimesForDay(openingTimesByDay.value, day);
}

// Format time range (wrapper for template usage)
function formatTimeRange(opening: OpeningTime): string {
    return formatOpeningTimeRange(opening, props.compact);
}
</script>

<template>
    <div class="opening-hours-timetable">
        <!-- Timetable -->
        <div v-if="!openingTimes || openingTimes.length === 0" class="no-hours">
            <div
                class="flex flex-col items-center justify-center text-gray-500"
                :class="compact ? 'py-3' : 'py-8'">
                <FontAwesomeIcon
                    :icon="faClock"
                    :class="compact ? 'mb-1 text-lg' : 'mb-3 text-3xl'" />
                <p :class="compact ? 'text-xs' : 'text-sm'">Geen openingstijden beschikbaar</p>
            </div>
        </div>

        <div v-else class="overflow-hidden rounded-lg shadow-sm">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            :class="compact ? 'px-3 py-1 text-xs' : 'px-4 py-3 text-xs'"
                            class="text-left font-medium tracking-wider text-gray-500 uppercase">
                            Dag
                        </th>
                        <th
                            :class="compact ? 'px-3 py-1 text-xs' : 'px-4 py-3 text-xs'"
                            class="text-right font-medium tracking-wider text-gray-500 uppercase">
                            Tijden
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    <tr
                        v-for="day in weekDays"
                        :key="day.toDateString()"
                        :class="{ 'bg-primary-50': isToday(day) }">
                        <td :class="compact ? 'px-3 py-1' : 'px-4 py-3'">
                            <span
                                :class="[
                                    compact ? 'text-xs' : 'text-sm',
                                    'font-medium',
                                    isToday(day) ? 'text-primary-500' : 'text-gray-900',
                                ]">
                                {{ formatDayName(day, compact ? 'short' : 'long', locale) }}
                            </span>
                        </td>

                        <td :class="compact ? 'px-3 py-1' : 'px-4 py-3'" class="text-right">
                            <template v-if="getOpeningTimesForDayWrapper(day).length > 0">
                                <div class="flex">
                                    <template
                                        v-for="opening in getOpeningTimesForDayWrapper(day)"
                                        :key="opening.id">
                                        <div class="ml-auto text-xs">
                                            {{ formatTimeRange(opening) }}
                                        </div>
                                    </template>
                                </div>
                            </template>
                            <span
                                v-else
                                :class="compact ? 'text-xs' : 'text-sm'"
                                class="text-gray-400 italic">
                                Gesloten
                            </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.no-hours {
    @apply rounded-lg bg-gray-50;
}
</style>
