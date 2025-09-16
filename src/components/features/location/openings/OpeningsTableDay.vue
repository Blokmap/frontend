<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getOpeningTimesForDay } from '@/domain/openings/helpers';
import { timeToString } from '@/utils/date';
import { formatDayName, isToday } from '@/utils/date/date';
import type { OpeningTime } from '@/domain/openings';

defineProps<{
    day: Date;
    openingTimesByDay: Map<string, OpeningTime[]>;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="day" :class="{ today: isToday(day) }">
        <span class="font-medium" :class="isToday(day) ? 'text-primary-700' : 'text-gray-900'">
            {{ formatDayName(day, 'long', locale) }}
        </span>

        <div class="text-right">
            <template v-if="getOpeningTimesForDay(openingTimesByDay, day).length > 0">
                <div class="space-y-0.5">
                    <div
                        v-for="opening in getOpeningTimesForDay(openingTimesByDay, day)"
                        :key="opening.id"
                        class="font-mono text-xs"
                        :class="isToday(day) ? 'text-primary-700' : 'text-gray-600'">
                        {{ timeToString(opening.startTime, true) }}–{{
                            timeToString(opening.endTime, true)
                        }}
                    </div>
                </div>
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

.day {
    @apply flex min-h-[50px] items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors;
    @apply bg-gray-50 hover:bg-gray-50;

    &.today {
        @apply bg-primary-50;
        @apply hover:bg-primary-50;
    }
}
</style>
