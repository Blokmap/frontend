<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatDayName, isToday } from '@/utils/date';
import { formatTimeRange } from '@/utils/time';
import type { OpeningTime } from '@/domain/openings';

const props = defineProps<{
    day: Date;
    loading?: boolean;
    openings?: OpeningTime[];
}>();

const { locale } = useI18n();

const times = computed<string>(() => {
    if (!props.openings || props.openings.length === 0) {
        return '';
    }

    return props.openings
        .map((opening) => formatTimeRange(opening.startTime, opening.endTime, true))
        .join(', ');
});
</script>

<template>
    <div class="openings-day" :class="{ 'openings-day--today': isToday(day) }">
        <span class="openings-day__label">
            {{ formatDayName(day, 'short', locale) }}
        </span>

        <div class="openings-day__times">
            <template v-if="openings && openings.length > 0">
                <span class="openings-day__time">{{ times }}</span>
            </template>
            <template v-else-if="loading">
                <Skeleton width="60px" height="25px" />
            </template>
            <span v-else class="openings-day__closed"> Gesloten </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.openings-day {
    @apply flex items-center justify-between px-4 py-2.5;
    @apply rounded-lg transition-colors last:border-b-0;

    &.openings-day--today {
        @apply border-b-0 bg-slate-100;
        @apply bg-primary-50 hover:bg-primary-100;

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
