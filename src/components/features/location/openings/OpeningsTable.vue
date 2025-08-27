<script setup lang="ts">
import type { OpeningTime } from '@/domain/openings';
import { endOfWeek, formatDayName, startOfWeek } from '@/utils/date/date';
import { timeToString } from '@/utils/date/time';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Badge from 'primevue/badge';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
    openingTimes?: OpeningTime[];
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

    const grouped = new Map<string, OpeningTime[]>();

    props.openingTimes.forEach((opening) => {
        const dayKey = opening.day.toDateString();
        if (!grouped.has(dayKey)) {
            grouped.set(dayKey, []);
        }
        grouped.get(dayKey)!.push(opening);
    });

    // Sort times for each day
    grouped.forEach((times) => {
        times.sort((a, b) => {
            const aMinutes = a.startTime.hours * 60 + a.startTime.minutes;
            const bMinutes = b.startTime.hours * 60 + b.startTime.minutes;
            return aMinutes - bMinutes;
        });
    });

    return grouped;
});

// Get opening times for a specific day
function getOpeningTimesForDay(day: Date): OpeningTime[] {
    return openingTimesByDay.value.get(day.toDateString()) || [];
}

// Check if a day is today
function isToday(day: Date): boolean {
    const today = new Date();
    return day.toDateString() === today.toDateString();
}

// Format time range
function formatTimeRange(opening: OpeningTime): string {
    return `${timeToString(opening.startTime)} - ${timeToString(opening.endTime)}`;
}
</script>

<template>
    <div class="opening-hours-timetable">
        <!-- Timetable -->
        <div v-if="!openingTimes || openingTimes.length === 0" class="no-hours">
            <div class="flex flex-col items-center justify-center py-8 text-gray-500">
                <FontAwesomeIcon :icon="faClock" class="mb-3 text-3xl" />
                <p class="text-sm">Geen openingstijden beschikbaar</p>
            </div>
        </div>

        <div v-else class="overflow-hidden rounded-lg shadow-sm">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th
                            class="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Dag
                        </th>
                        <th
                            class="px-4 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Tijden
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white">
                    <tr
                        v-for="day in weekDays"
                        :key="day.toDateString()"
                        :class="{ 'bg-primary-50': isToday(day) }">
                        <td class="px-4 py-3">
                            <span
                                class="text-sm font-medium"
                                :class="isToday(day) ? 'text-primary-500' : 'text-gray-900'">
                                {{ formatDayName(day, 'long', locale) }}
                            </span>
                        </td>

                        <td class="px-4 py-3 text-right">
                            <template v-if="getOpeningTimesForDay(day).length > 0">
                                <div class="flex">
                                    <template
                                        v-for="opening in getOpeningTimesForDay(day)"
                                        :key="opening.id">
                                        <div class="ml-auto text-xs">
                                            {{ formatTimeRange(opening) }}
                                        </div>
                                    </template>
                                </div>
                            </template>
                            <span v-else class="text-sm text-gray-400 italic"> Gesloten </span>
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
