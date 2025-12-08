<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import ReservationCard from '@/components/features/reservation/ReservationCard.vue';
import { computed } from 'vue';
import { type Reservation } from '@/domain/reservation';
import { datesInRange, endOfWeek, isSameDay, isToday, startOfWeek } from '@/utils/date';
import { formatDayName } from '@/utils/date/dateFormatUtils';

const props = defineProps<{
    reservations: Reservation[] | undefined;
    loading: boolean;
    currentDate: Date;
    cancellingReservationId?: string | null;
}>();

const emit = defineEmits<{
    (e: 'cancel', reservation: Reservation): void;
}>();

const weekDays = computed(() => {
    const start = startOfWeek(props.currentDate);
    const end = endOfWeek(props.currentDate);
    return datesInRange(start, end);
});

function getReservationsForDay(day: Date) {
    if (!props.reservations) return [];
    return props.reservations.filter((r) => isSameDay(r.day, day));
}
</script>

<template>
    <div v-if="loading" class="reservations-grid">
        <Skeleton height="12rem" v-for="i in 4" :key="i" class="rounded-xl" />
    </div>

    <div v-else>
        <Transition name="fade">
            <TransitionGroup
                name="staggered-cards"
                tag="div"
                appear
                class="reservations-grid"
                :key="weekDays[0].getDate()">
                <div
                    v-for="(day, index) in weekDays"
                    class="day-card"
                    :key="day.toISOString()"
                    :style="{ '--i': index }"
                    :class="{ 'day-card--today': isToday(day) }">
                    <div class="day-card__header">
                        <span
                            class="day-card__title"
                            :class="{ 'day-card__title--today': isToday(day) }">
                            {{ formatDayName(day, 'long', 'nl') }}
                        </span>
                        <span class="day-card__date">
                            {{ day.getDate() }} {{ day.toLocaleString('nl', { month: 'short' }) }}
                        </span>
                    </div>

                    <div class="day-card__content">
                        <div v-if="getReservationsForDay(day).length > 0" class="space-y-3">
                            <ReservationCard
                                v-for="reservation in getReservationsForDay(day)"
                                :key="reservation.id"
                                :reservation="reservation"
                                :is-cancelling="cancellingReservationId === reservation.id"
                                @click:cancel="(r) => emit('cancel', r)">
                            </ReservationCard>
                        </div>
                        <div v-else class="day-card__empty">Geen reservaties</div>
                    </div>
                </div>
            </TransitionGroup>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.reservations-grid {
    @apply grid gap-6 md:grid-cols-2;
}

.day-card {
    @apply flex flex-col rounded-xl bg-white shadow-sm transition-all;

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

.staggered-cards-enter-active {
    transition-delay: calc(var(--i) * 0.05s);
}

.staggered-cards-leave-active {
    transition-delay: calc(var(--i) * 0.02s);
}
</style>
