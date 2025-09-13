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
}>();

const { locale } = useI18n();

const now = new Date();
const weekStart = startOfWeek(now);
const weekEnd = endOfWeek(now);

const weekDays = computed(() => {
    const days = [];
    const current = new Date(weekStart);

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
    <div class="opening-hours-timetable">
        <!-- Timetable -->
        <div v-if="!openingTimes || openingTimes.length === 0" class="no-hours">
            <div class="flex flex-col items-center justify-center py-4 text-gray-500">
                <FontAwesomeIcon :icon="faClock" class="mb-2 text-lg" />
                <p class="text-xs">Geen openingstijden beschikbaar</p>
            </div>
        </div>

        <div v-else class="overflow-hidden rounded-md">
            <table class="w-full">
                <thead class="border-b-2 border-slate-200 bg-gray-100">
                    <tr>
                        <th
                            class="px-3 py-2 text-left font-medium tracking-wider text-gray-500 uppercase">
                            Dag
                        </th>
                        <th
                            class="px-3 py-2 text-right font-medium tracking-wider text-gray-500 uppercase">
                            Tijden
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y-2 divide-slate-200">
                    <tr
                        v-for="day in weekDays"
                        :key="day.toDateString()"
                        :class="{ 'bg-primary-50': isToday(day) }">
                        <td class="px-3 py-2">
                            <span
                                class="text-sm font-medium"
                                :class="isToday(day) ? 'text-primary-500' : 'text-gray-900'">
                                {{ formatDayName(day, 'long', locale) }}
                            </span>
                        </td>

                        <td class="px-3 py-2 text-right">
                            <template
                                v-if="getOpeningTimesForDay(openingTimesByDay, day).length > 0">
                                <span class="text-xs text-gray-900">
                                    {{
                                        getOpeningTimesForDay(openingTimesByDay, day)
                                            .map((opening: OpeningTime) =>
                                                formatOpeningTimeRange(opening),
                                            )
                                            .join(' • ')
                                    }}
                                </span>
                            </template>
                            <span v-else class="text-xs text-gray-400 italic"> Gesloten </span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.opening-hours-timetable {
    @apply rounded-md border border-slate-200;
}

.no-hours {
    @apply rounded-lg bg-gray-50;
}
</style>
