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
    <div class="openings-day" :class="{ 'openings-day--today': isToday(day) }">
        <span class="openings-day__label">
            {{ formatDayName(day, 'short', locale) }}
        </span>

        <div class="openings-day__times">
            <template v-if="getOpeningTimesForDay(openingTimesByDay, day).length > 0">
                <span
                    v-for="(opening, index) in getOpeningTimesForDay(openingTimesByDay, day)"
                    :key="opening.id"
                    class="openings-day__time">
                    {{ timeToString(opening.startTime, true) }}–{{
                        timeToString(opening.endTime, true)
                    }}{{
                        index < getOpeningTimesForDay(openingTimesByDay, day).length - 1 ? ', ' : ''
                    }}
                </span>
            </template>
            <span v-else class="openings-day__closed"> Gesloten </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.openings-day {
    @apply flex items-center justify-between px-4 py-2.5;
    @apply border-b-2 border-slate-200 transition-colors last:border-b-0;

    &:hover {
        @apply bg-slate-50;
    }

    &.openings-day--today {
        @apply bg-secondary-50 rounded-lg border-b-0;

        &:hover {
            @apply bg-secondary-200;
        }

        .openings-day__label,
        .openings-day__time {
            @apply text-secondary-800;
        }

        .openings-day__closed {
            @apply text-secondary-800 text-sm italic;
        }
    }

    .openings-day__label {
        @apply text-sm font-semibold text-slate-700;
    }

    .openings-day__time {
        @apply font-mono text-sm font-medium text-slate-700;
    }

    .openings-day__closed {
        @apply text-sm text-slate-500 italic;
    }
}
</style>
