<script setup lang="ts">
import Badge from 'primevue/badge';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { RESERVATION_STATE_ICONS, ReservationState } from '@/domain/reservation';

defineProps<{
    state: ReservationState;
}>();

const severities: Record<ReservationState, string> = {
    [ReservationState.Created]: 'info',
    [ReservationState.Present]: 'success',
    [ReservationState.Absent]: 'danger',
    [ReservationState.Rejected]: 'contrast',
    [ReservationState.Pending]: 'warn',
};
</script>

<template>
    <Badge :severity="severities[state]">
        <div class="flex w-full items-center justify-around gap-1">
            <FontAwesomeIcon
                :icon="RESERVATION_STATE_ICONS[state]"
                :spin="state === ReservationState.Pending" />
            <span>{{ $t(`domains.reservations.state.${state.toLowerCase()}`) }}</span>
        </div>
    </Badge>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
