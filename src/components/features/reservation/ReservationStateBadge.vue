<script setup lang="ts">
import { ReservationState } from '@/domain/reservation';
import { faCheckCircle, faHourglassHalf, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Badge from 'primevue/badge';

defineProps<{
    state: ReservationState;
}>();
</script>

<template>
    <!-- Present State -->
    <template v-if="state === ReservationState.Present">
        <Badge severity="success" class="p-2">
            <FontAwesomeIcon :icon="faCheckCircle" />
        </Badge>
    </template>

    <!-- Absent State -->
    <template v-if="state === ReservationState.Absent">
        <Badge severity="danger" class="p-2">
            <FontAwesomeIcon :icon="faTimesCircle" />
        </Badge>
    </template>

    <!-- Cancelled State -->
    <template v-if="state === ReservationState.Cancelled">
        <Badge severity="danger" class="p-2">
            <FontAwesomeIcon :icon="faTimesCircle" />
        </Badge>
    </template>

    <!-- Created State -->
    <template v-if="state === ReservationState.Created">
        <Badge severity="warning" class="p-2">
            <FontAwesomeIcon :icon="faHourglassHalf" />
        </Badge>
    </template>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
