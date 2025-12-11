<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import { computed } from 'vue';
import { type Reservation } from '@/domain/reservation';
import { datesInRange, endOfWeek, isSameDay, startOfWeek } from '@/utils/date';

const props = defineProps<{
    reservations: Reservation[] | undefined;
    loading: boolean;
    currentDate: Date;
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
                <slot
                    name="card"
                    v-for="(day, index) in weekDays"
                    :key="day.toISOString()"
                    :day="day"
                    :reservations="getReservationsForDay(day)">
                </slot>
            </TransitionGroup>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.reservations-grid {
    @apply grid gap-6 md:grid-cols-2;
}

.staggered-cards-enter-active {
    transition-delay: calc(var(--i) * 0.05s);
}

.staggered-cards-leave-active {
    transition-delay: calc(var(--i) * 0.02s);
}
</style>
