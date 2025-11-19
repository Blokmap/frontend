<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getOpeningTimesForDay } from '@/domain/openings/helpers';
import { formatDayName, isToday } from '@/utils/date';
import { timeToString } from '@/utils/time';
import type { OpeningTime } from '@/domain/openings';

defineProps<{
    day: Date;
    openingTimesByDay: Map<string, OpeningTime[]>;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="openings-day" :class="isToday(day) ? 'bg-primary-50' : 'hover:bg-slate-50'">
        <span
            class="text-sm font-medium"
            :class="isToday(day) ? 'text-primary-700' : 'text-slate-700'">
            {{ formatDayName(day, 'short', locale) }}
        </span>

        <div>
            <template v-if="getOpeningTimesForDay(openingTimesByDay, day).length > 0">
                <span
                    v-for="(opening, index) in getOpeningTimesForDay(openingTimesByDay, day)"
                    :key="opening.id"
                    class="font-mono text-sm"
                    :class="isToday(day) ? 'text-primary-700' : 'text-slate-600'">
                    {{ timeToString(opening.startTime, true) }}–{{
                        timeToString(opening.endTime, true)
                    }}{{
                        index < getOpeningTimesForDay(openingTimesByDay, day).length - 1 ? ', ' : ''
                    }}
                </span>
            </template>
            <span
                v-else
                class="text-sm italic"
                :class="isToday(day) ? 'text-primary-500' : 'text-slate-400'">
                Gesloten
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.openings-day {
    @apply flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors;
}
</style>
