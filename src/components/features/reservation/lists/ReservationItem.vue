<script setup lang="ts">
import ReservationStateBadge from '@/components/features/reservation/state/ReservationStateBadge.vue';
import { type Reservation } from '@/domain/reservation';
import { formatReservationDateTime } from '@/domain/reservation/helpers/format';

defineProps<{
    reservation: Reservation;
}>();
</script>

<template>
    <div
        class="flex items-center gap-4 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
        <div class="flex-shrink-0">
            <ReservationStateBadge :state="reservation.state" />
        </div>
        <div class="min-w-0 flex-1">
            <div class="truncate font-medium text-gray-900">
                {{ reservation.location?.name || 'Onbekende Locatie' }}
            </div>
            <div class="text-sm text-gray-600">
                {{ formatReservationDateTime(reservation) }}
            </div>
        </div>
    </div>
</template>
