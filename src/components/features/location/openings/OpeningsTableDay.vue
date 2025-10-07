<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getOpeningTimesForDay } from '@/domain/openings/helpers';
import { timeToString } from '@/utils/date';
import type { OpeningTime } from '@/domain/openings';
import { formatDayName, isToday } from '@/utils/date/date';

defineProps<{
    day: Date;
    openingTimesByDay: Map<string, OpeningTime[]>;
    isLast?: boolean;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="table-row" :class="{ today: isToday(day), 'last-row': isLast }">
        <div class="flex-1 px-4 py-2.5">
            <span
                class="text-sm font-medium"
                :class="isToday(day) ? 'text-primary-700' : 'text-gray-900'">
                {{ formatDayName(day, 'short', locale) }}
            </span>
        </div>

        <div class="flex-1 px-4 py-2.5 text-right">
            <template v-if="getOpeningTimesForDay(openingTimesByDay, day).length > 0">
                <span
                    v-for="(opening, index) in getOpeningTimesForDay(openingTimesByDay, day)"
                    :key="opening.id"
                    class="font-mono text-xs"
                    :class="isToday(day) ? 'text-primary-700' : 'text-gray-600'">
                    {{ timeToString(opening.startTime, true) }}–{{
                        timeToString(opening.endTime, true)
                    }}{{
                        index < getOpeningTimesForDay(openingTimesByDay, day).length - 1 ? ', ' : ''
                    }}
                </span>
            </template>
            <span
                v-else
                class="text-xs italic"
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
</style>
