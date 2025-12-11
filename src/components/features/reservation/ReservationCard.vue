<script lang="ts" setup>
import Button from 'primevue/button';
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useFloatingPosition } from '@/composables/useFloatingPosition';
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

const deleteButtonRef = ref<HTMLElement | null>(null);
const confirmPopoverRef = ref<HTMLElement | null>(null);
const showConfirmPopover = ref(false);

const { positionStyles } = useFloatingPosition(
    deleteButtonRef,
    confirmPopoverRef,
    showConfirmPopover,
);

function onDeleteClick() {
    showConfirmPopover.value = !showConfirmPopover.value;
}

function onConfirmCancel() {
    showConfirmPopover.value = false;
    emit('click:cancel', props.reservation);
}

function onCancelPopover() {
    showConfirmPopover.value = false;
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
            <div v-if="isReservationInFuture(reservation)" ref="deleteButtonRef">
                <Button
                    size="small"
                    severity="contrast"
                    text
                    rounded
                    :disabled="!isReservationCancellable(reservation) || isCancelling"
                    @click="onDeleteClick"
                    v-tooltip.top="'Annuleren'">
                    <template #icon>
                        <FontAwesomeIcon :icon="faTrash" />
                    </template>
                </Button>
            </div>
        </div>

        <Teleport to="body">
            <Transition name="slide-down">
                <div
                    v-if="showConfirmPopover"
                    ref="confirmPopoverRef"
                    :style="positionStyles"
                    class="confirm-popover">
                    <p class="confirm-popover__text">Reservatie annuleren?</p>
                    <div class="confirm-popover__actions">
                        <Button
                            size="small"
                            severity="secondary"
                            text
                            label="Annuleren"
                            @click="onCancelPopover" />
                        <Button
                            size="small"
                            severity="danger"
                            label="Bevestigen"
                            :loading="isCancelling"
                            @click="onConfirmCancel" />
                    </div>
                </div>
            </Transition>
        </Teleport>
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

.confirm-popover {
    @apply rounded-lg border border-slate-200 bg-white p-3 shadow-lg;
    width: max-content;
    max-width: 300px;
}

.confirm-popover__text {
    @apply mb-3 text-sm font-medium text-slate-900;
}

.confirm-popover__actions {
    @apply flex items-center justify-end gap-2;
}
</style>
