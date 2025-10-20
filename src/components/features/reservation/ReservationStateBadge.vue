<script setup lang="ts">
import Badge from 'primevue/badge';
import {
    faBan,
    faCheck,
    faClock,
    faHourglassHalf,
    faTimes,
    type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ReservationState, type Reservation } from '@/domain/reservation';

defineProps<{
    reservation: Reservation;
}>();

const severities: Record<ReservationState, string> = {
    [ReservationState.Created]: 'info',
    [ReservationState.Present]: 'success',
    [ReservationState.Absent]: 'danger',
    [ReservationState.Cancelled]: 'contrast',
    [ReservationState.Pending]: 'warn',
};

const icons: Record<ReservationState, IconDefinition> = {
    [ReservationState.Created]: faHourglassHalf,
    [ReservationState.Present]: faCheck,
    [ReservationState.Absent]: faTimes,
    [ReservationState.Cancelled]: faBan,
    [ReservationState.Pending]: faClock,
};

const labels: Record<ReservationState, string> = {
    [ReservationState.Created]: 'Te bevestigen',
    [ReservationState.Present]: 'Bevestigd',
    [ReservationState.Absent]: 'Afwezig',
    [ReservationState.Cancelled]: 'Geannuleerd',
    [ReservationState.Pending]: 'In behandeling',
};
</script>

<template>
    <Badge :severity="severities[reservation.state]" class="w-[120px]">
        <div class="flex w-full items-center justify-around gap-1">
            <FontAwesomeIcon :icon="icons[reservation.state]" />
            <span>{{ labels[reservation.state] }}</span>
        </div>
    </Badge>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
