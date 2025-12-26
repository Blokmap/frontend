<script setup lang="ts">
import Badge from 'primevue/badge';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { RESERVATION_STATE_ICONS, ReservationState } from '@/domain/reservation';

defineProps<{
    state: ReservationState;
}>();

const severities: Record<ReservationState, string> = {
    [ReservationState.Created]: 'success',
    [ReservationState.Present]: 'success',
    [ReservationState.Absent]: 'danger',
    [ReservationState.Rejected]: 'contrast',
    [ReservationState.Pending]: 'info',
};
</script>

<template>
    <Badge :severity="severities[state]">
        <div class="flex w-full items-center justify-around gap-1">
            <FontAwesomeIcon
                :icon="RESERVATION_STATE_ICONS[state]"
                :spin="state === ReservationState.Pending">
            </FontAwesomeIcon>
            <span>{{ $t(`domains.reservations.state.${state}`) }}</span>
        </div>
    </Badge>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
