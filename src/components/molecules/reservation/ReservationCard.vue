<script lang="ts" setup>
import Button from 'primevue/button';
import ConfirmPopover from '@/components/molecules/ConfirmPopover.vue';
import ImageStack from '@/components/molecules/ImageStack.vue';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { getLocationImages, type Image } from '@/domain/image';
import {
    formatReservationTimeRange,
    isReservationCancellable,
    isReservationInFuture,
    type Reservation,
} from '@/domain/reservation';

const props = defineProps<{
    reservation: Reservation;
    isCancelling?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click:cancel', reservation: Reservation): void;
}>();

const images = computed<Image[]>(() => getLocationImages([props.reservation.location]));

function onConfirmCancel() {
    emit('click:cancel', props.reservation);
}
</script>

<template>
    <div class="reservation-card">
        <div class="reservation-card__header">
            <ImageStack class="reservation-card__stack" :images="images"> </ImageStack>
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
                    {{ formatReservationTimeRange(reservation) }}
                </p>
            </div>
            <ConfirmPopover
                v-if="isReservationInFuture(reservation)"
                message="Reservatie annuleren?"
                :loading="isCancelling"
                @confirm="onConfirmCancel">
                <template #trigger="{ toggle }">
                    <Button
                        size="small"
                        severity="contrast"
                        text
                        rounded
                        :disabled="!isReservationCancellable(reservation) || isCancelling"
                        @click="toggle"
                        v-tooltip.top="'Annuleren'">
                        <template #icon>
                            <FontAwesomeIcon :icon="faTrash" />
                        </template>
                    </Button>
                </template>
            </ConfirmPopover>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.reservation-card {
    @apply flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3;

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
