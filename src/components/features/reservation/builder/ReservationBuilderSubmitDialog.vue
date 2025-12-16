<script setup lang="ts">
import Dialog from 'primevue/dialog';
import { computed } from 'vue';
import { ReservationState, type Reservation } from '@/domain/reservation';
import ProfileReservationsTable from '../table/ProfileReservationsTable.vue';

const props = defineProps<{
    reservations: Reservation[];
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

// const hasPendingReservations = computed<boolean>(() => {
//     return props.reservations.some((r) => r.state === ReservationState.Pending);
// });

// const hasRejectedReservations = computed<boolean>(() => {
//     return props.reservations.some((r) => r.state === ReservationState.Rejected);
// });

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
        class="submit-dialog"
        v-model:visible="visible"
        :closable="closable"
        :close-on-escape="closable"
        :dismissable-mask="closable"
        @hide="onCloseDialog"
        modal>
        <template #container>
            <div class="submit-dialog__container">
                <div class="submit-dialog__body">
                    <!-- <Callout :severity="calloutSeverity">
                        <div class="flex items-center gap-3">
                            <ProgressSpinner
                                v-if="hasPendingReservations"
                                class="h-6 w-6"
                                stroke-width="4">
                            </ProgressSpinner>
                            <span>{{ calloutMessage }}</span>
                        </div>
                    </Callout> -->

                    <ProfileReservationsTable :reservations="reservations" :show-actions="false" />
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.submit-dialog {
    @apply w-full max-w-lg;

    .submit-dialog__container {
        @apply space-y-6;
    }

    .submit-dialog__header {
        @apply px-4 text-lg font-semibold;
    }

    .submit-dialog__body {
        @apply space-y-8;
    }

    .submit-dialog__footer {
        @apply flex justify-end gap-2 px-4;
    }
}
</style>
