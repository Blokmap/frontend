<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
import { useI18n } from 'vue-i18n';
import { formatDayName, isToday } from '@/utils/date';
import { timeToString } from '@/utils/time';
import type { OpeningTime } from '@/domain/openings';

defineProps<{
    day: Date;
    loading?: boolean;
    openings?: OpeningTime[];
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="openings-day" :class="{ 'openings-day--today': isToday(day) }">
        <span class="openings-day__label">
            {{ formatDayName(day, 'short', locale) }}
        </span>

        <div class="openings-day__times">
            <template v-if="openings && openings.length > 0">
                <span
                    v-for="(opening, index) in openings"
                    :key="opening.id"
                    class="openings-day__time">
                    {{ timeToString(opening.startTime, true) }}–{{
                        timeToString(opening.endTime, true)
                    }}{{ index < openings.length - 1 ? ', ' : '' }}
                </span>
            </template>
            <template v-else-if="loading">
                <Skeleton width="75px" height="16px"></Skeleton>
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

    &:has(+ .openings-day--today) {
        @apply border-b-0;
    }

    &.openings-day--today {
        @apply bg-primary-50 rounded-lg border-b-0;

        &:hover {
            @apply bg-primary-100;
        }

        .openings-day__label,
        .openings-day__time {
            @apply text-primary-800;
        }

        .openings-day__closed {
            @apply text-primary-800 text-sm italic;
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
