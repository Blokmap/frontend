<script lang="ts" setup>
import { isToday } from '@/utils/date';
import { formatDayName } from '@/utils/date/dateFormatUtils';

defineProps<{
    day: Date;
}>();
</script>

<template>
    <div
        class="day-card"
        :class="{ 'day-card--today': isToday(day) }"
        :style="{ '--i': day.getDay() }">
        <div class="day-card__header">
            <span class="day-card__title" :class="{ 'day-card__title--today': isToday(day) }">
                {{ formatDayName(day, 'long', 'nl') }}
            </span>
            <span class="day-card__date">
                {{ day.getDate() }} {{ day.toLocaleString('nl', { month: 'short' }) }}
            </span>
        </div>

        <div class="day-card__content">
            <div v-if="$slots.reservation" class="space-y-3">
                <slot name="reservation"></slot>
            </div>
            <div class="day-card__empty" v-else>
                <slot name="empty"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.day-card {
    @apply flex flex-col rounded-xl border border-slate-200 bg-white transition-all;

    &.day-card--today {
        @apply ring-secondary-400 ring-2 ring-offset-2;
    }

    .day-card__header {
        @apply flex items-center justify-between border-b border-slate-100 px-4 py-3;
    }

    .day-card__title {
        @apply text-lg font-bold text-slate-700 capitalize;

        &.day-card__title--today {
            @apply text-secondary-600;
        }
    }

    .day-card__date {
        @apply text-sm font-medium text-slate-400;
    }

    .day-card__content {
        @apply flex-1 space-y-3 p-4;
    }

    .day-card__empty {
        @apply flex h-full items-center justify-center py-8 text-sm text-slate-400 italic;
    }
}
</style>
