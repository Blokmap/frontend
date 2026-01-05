<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { getLocationImageUrl, type Location } from '@/domain/location';
import { ReservationState, type Reservation } from '@/domain/reservation';
import ProfileReservationsTable from '../table/ProfileReservationsTable.vue';

const props = defineProps<{
    reservations: Reservation[];
    location: Location;
}>();

const emit = defineEmits<{
    close: [void];
}>();

const visible = defineModel<boolean>('visible', {
    required: true,
});

const closable = computed<boolean>(() => {
    return props.reservations.every((r) => r.state !== ReservationState.Pending);
});

const pendingReservationsCount = computed<number>(() => {
    return props.reservations.filter((r) => r.state === ReservationState.Pending).length;
});

const hasPendingReservations = computed<boolean>(() => {
    return pendingReservationsCount.value > 0;
});

const hasRejectedReservations = computed<boolean>(() => {
    return props.reservations.some((r) => r.state === ReservationState.Rejected);
});

// const calloutSeverity = computed(() => {
//     if (hasPendingReservations.value) return 'info';
//     if (hasRejectedReservations.value) return 'warn';
//     return 'success';
// });

// const calloutMessage = computed(() => {
//     if (hasPendingReservations.value) {
//         return 'Reservaties worden verwerkt...';
//     }
//     if (hasRejectedReservations.value) {
//         return 'Sommige reservaties zijn afgewezen.';
//     }
//     return 'Alle reservaties zijn geaccepteerd!';
// });

const onCloseDialog = (): void => {
    emit('close');
    visible.value = false;
};
</script>

<template>
    <Dialog
        v-model:visible="visible"
        :closable="closable"
        :close-on-escape="closable"
        :dismissable-mask="closable"
        @hide="onCloseDialog"
        modal>
        <template #container>
            <div class="submit-dialog__container">
                <div class="submit-dialog__header">
                    <img
                        class="header__img"
                        :src="getLocationImageUrl(location)"
                        alt="Location image" />
                    <div class="header__overlay"></div>
                    <div class="header__content">
                        <Transition name="fade" mode="out-in">
                            <h2 v-if="hasPendingReservations">
                                <span class="mr-2">Je reservaties worden verwerkt</span>
                                <FontAwesomeIcon :icon="faSpinner" spin />
                            </h2>
                            <h2 v-else-if="hasRejectedReservations">
                                Sommige reservaties werden afgewezen
                            </h2>
                            <h2 v-else>Alle reservaties zijn goedgekeurd</h2>
                        </Transition>
                    </div>
                </div>
                <div class="submit-dialog__content">
                    <ProfileReservationsTable
                        :reservations="reservations"
                        :show-location="false"
                        :show-created-date="false"
                        :show-actions="!hasPendingReservations">
                    </ProfileReservationsTable>
                </div>
                <div class="submit-dialog__footer"></div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.submit-dialog__container {
    @apply w-[min(90vw,30rem)];

    .submit-dialog__header {
        @apply relative h-48 w-full overflow-hidden rounded-t-xl;

        .header__img {
            @apply absolute inset-0 h-full w-full object-cover;
        }

        .header__overlay {
            @apply absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60;
        }

        .header__content {
            @apply relative z-10 flex h-full items-center justify-center px-6 py-4;

            h2 {
                @apply m-0 text-2xl font-bold text-white drop-shadow-lg;
            }
        }
    }
}
</style>
