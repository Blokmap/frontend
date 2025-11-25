<script lang="ts" setup>
import Button from 'primevue/button';
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { getLocationImages } from '@/domain/image';
import {
    isReservationCancellable,
    isReservationInFuture,
    type Reservation,
} from '@/domain/reservation';
import { formatTime } from '@/utils/time';
import type { Location } from '@/domain/location';

const props = defineProps<{
    reservation: Reservation;
    recentLocations: Location[] | undefined;
    isCancelling?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click:cancel', reservation: Reservation): void;
}>();

function getReservationLocationImages(reservation: Reservation) {
    const locations = props.recentLocations?.filter((loc) => loc.id === reservation.location?.id);
    return getLocationImages(locations);
}

function formatReservationTime(reservation: Reservation) {
    return `${formatTime(reservation.startTime)} - ${formatTime(reservation.endTime)}`;
}

function onCancel() {
    emit('click:cancel', props.reservation);
}
</script>

<template>
    <div class="reservation-card">
        <div class="reservation-card__header">
            <ImageStack
                class="reservation-card__stack"
                :images="getReservationLocationImages(reservation)">
            </ImageStack>
            <div class="min-w-0 flex-1">
                <RouterLink
                    v-if="reservation.location"
                    :to="{
                        name: 'locations.detail',
                        params: { locationId: reservation.location.id },
                    }"
                    class="reservation-card__location"
                    :title="reservation.location.name">
                    {{ reservation.location.name }}
                </RouterLink>
                <p class="reservation-card__time">
                    {{ formatReservationTime(reservation) }}
                </p>
            </div>
            <Button
                v-if="isReservationInFuture(reservation)"
                size="small"
                severity="contrast"
                text
                rounded
                :disabled="!isReservationCancellable(reservation) || isCancelling"
                @click="onCancel"
                v-tooltip.top="'Annuleren'">
                <template #icon>
                    <FontAwesomeIcon :icon="faTrash" />
                </template>
            </Button>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.reservation-card {
    @apply flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50 p-3;

    .reservation-card__header {
        @apply flex items-center justify-between gap-2;
    }

    .reservation-card__location {
        @apply hover:text-primary-600 block truncate font-semibold text-slate-900 hover:underline;
    }

    .reservation-card__time {
        @apply mt-1 text-sm text-slate-500;
    }

    .reservation-card__stack {
        @apply h-14 w-14 flex-shrink-0 rounded-lg;
    }
}
</style>
