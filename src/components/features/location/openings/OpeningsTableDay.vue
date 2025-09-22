<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getOpeningTimesForDay } from '@/domain/openings/helpers';
import { timeToString } from '@/utils/date';
import { formatDayName, isToday } from '@/utils/date/date';
import type { OpeningTime } from '@/domain/openings';

defineProps<{
    day: Date;
    openingTimesByDay: Map<string, OpeningTime[]>;
    isLast?: boolean;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="table-row" :class="{ today: isToday(day), 'last-row': isLast }">
        <div class="day-cell">
            <span class="day-name" :class="isToday(day) ? 'text-primary-700' : 'text-gray-900'">
                {{ formatDayName(day, 'short', locale) }}
            </span>
        </div>

        <div class="times-cell">
            <template v-if="getOpeningTimesForDay(openingTimesByDay, day).length > 0">
                <div class="opening-times">
                    <span
                        v-for="(opening, index) in getOpeningTimesForDay(openingTimesByDay, day)"
                        :key="opening.id"
                        class="time-range"
                        :class="isToday(day) ? 'text-primary-700' : 'text-gray-600'">
                        {{ timeToString(opening.startTime, true) }}–{{
                            timeToString(opening.endTime, true)
                        }}<template
                            v-if="index < getOpeningTimesForDay(openingTimesByDay, day).length - 1"
                            >,
                        </template>
                    </span>
                </div>
            </template>
            <span
                v-else
                class="closed-text"
                :class="isToday(day) ? 'text-primary-500' : 'text-gray-400'">
                Gesloten
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.table-row {
    @apply relative flex items-center border-b border-gray-200 bg-white text-sm transition-colors;

    &.today {
        @apply bg-primary-50;
    }

    &.last-row {
        @apply border-b-0;
    }

    &:hover {
        @apply bg-gray-50;

        &.today {
            @apply bg-primary-100;
        }
    }

    &::after {
        @apply absolute top-0 bottom-0 left-1/2 border-l border-gray-200 content-[''];
    }
}

.day-cell {
    @apply flex-1 px-4 py-2.5;
}

.day-name {
    @apply text-sm font-medium;
}

.times-cell {
    @apply flex-1 px-4 py-2.5 text-right;
}

.opening-times {
    @apply space-x-1;
}

.time-range {
    @apply font-mono text-xs;
}

.closed-text {
    @apply text-xs italic;
}
</style>
