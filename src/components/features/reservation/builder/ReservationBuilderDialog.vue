<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import ReservationBuilderCalendar from '@/components/features/reservation/builder/ReservationBuilderCalendar.vue';
import ReservationBuilderLegend from '@/components/features/reservation/builder/ReservationBuilderLegend.vue';
import ReservationBuilderSubmitDialog from '@/components/features/reservation/builder/ReservationBuilderSubmitDialog.vue';
import FloatingPopover from '@/components/shared/atoms/FloatingPopover.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import TimeInput from '@/components/shared/molecules/form/TimeInput.vue';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import {
    useCreateReservations,
    useDeleteReservations,
    useReadProfileReservations,
} from '@/composables/data/useReservations';
import { useWebsocket } from '@/composables/data/useWebsocket';
import {
    type ReservationFilter,
    type Reservation,
    type ReservationBody,
    ReservationState,
    adjustReservationForOverlaps,
    canDeleteReservation,
} from '@/domain/reservation';
import {
    WebsocketChannelName,
    WebsocketMessageEvent,
    type WebsocketMessage,
} from '@/domain/websocket';
import type { TimeSlot } from '@/domain/calendar';
import type { Location } from '@/domain/location';
import type { OpeningTime } from '@/domain/openings';

const props = defineProps<{
    location: Location;
    openings: OpeningTime[];
    openingsLoading?: boolean;
}>();

const router = useRouter();

const visible = defineModel<boolean>('visible', {
    required: true,
});

const currentWeek = defineModel<Date>('date', {
    required: true,
});

const { profileId } = useAuthProfile();

const reservationFilters = computed<ReservationFilter>(() => ({
    inWeekOf: currentWeek.value,
    locationId: props.location.id,
}));

const {
    data: reservations,
    isFetching: isFetchingReservations,
    refetch: refetchReservations,
} = useReadProfileReservations(profileId, reservationFilters);

const { mutateAsync: createReservations } = useCreateReservations({
    disableToasts: true,
});

const { mutateAsync: deleteReservations } = useDeleteReservations();

const enableWebsocket = computed(() => {
    return visible.value && props.location.isReservable;
});

const { subscribe } = useWebsocket(enableWebsocket);

// Update reservation states from websocket messages
const createdReservationStates = ref<Record<string, ReservationState>>({});
const createdReservations = ref<Reservation[]>([]);

const progressedCreatedReservations = computed<Reservation[]>(() => {
    return createdReservations.value.map((reservation) => {
        const updatedState = createdReservationStates.value[reservation.id];

        if (updatedState) {
            return { ...reservation, state: updatedState };
        }

        return reservation;
    });
});

watchEffect(() => {
    const isVisible = visible.value;
    const currentProfileId = profileId.value;

    if (!isVisible || !currentProfileId) {
        return;
    }

    const onMessage = (message: WebsocketMessage<any>) => {
        const { reservationId } = message.data;

        if (!reservationId) {
            return;
        }

        switch (message.event) {
            case WebsocketMessageEvent.ReservationCreated:
                createdReservationStates.value[reservationId] = ReservationState.Created;
                break;
            default:
                createdReservationStates.value[reservationId] = ReservationState.Rejected;
                break;
        }
    };

    subscribe(
        {
            name: WebsocketChannelName.Reservations,
            meta: { profileId: currentProfileId },
        },
        onMessage,
    );
});

// Builder state
const reservationsToCreate = ref<ReservationBody[]>([]);
const reservationsToDelete = ref<Reservation[]>([]);

// Popover state
const popoverTriggerRef = ref<HTMLElement | null>(null);
const isPopoverVisible = ref(false);

const activeRequest = ref<ReservationBody | null>(null);
const activeOpeningTimeSlot = ref<TimeSlot<OpeningTime> | null>(null);

const showProgressDialog = computed<boolean>({
    get: () => createdReservations.value.length > 0,
    set: (value: boolean) => {
        if (value === false) {
            createdReservations.value = [];
            createdReservationStates.value = {};
        }
    },
});

const hasPendingChanges = computed(() => {
    return reservationsToCreate.value.length + reservationsToDelete.value.length > 0;
});

const isSaving = ref<boolean>(false);

const isLoading = computed<boolean>(() => {
    return isFetchingReservations.value || props.openingsLoading || false;
});

const onOpeningTimeClick = (slot: TimeSlot<OpeningTime>, event: Event): void => {
    if (isSaving.value || !slot.metadata) {
        return;
    }

    isPopoverVisible.value = true;
    activeOpeningTimeSlot.value = slot;
    popoverTriggerRef.value = event.currentTarget as HTMLElement;

    activeRequest.value = {
        day: slot.metadata.day,
        openingTimeId: slot.metadata.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
    };
};

const onRequestDelete = (request: ReservationBody): void => {
    if (isSaving.value) {
        return;
    }

    const index = reservationsToCreate.value.findIndex((r) => r === request);

    if (index !== -1) {
        reservationsToCreate.value.splice(index, 1);
    }
};

const onReservationCreate = (): void => {
    if (!activeRequest.value || !reservations.value) {
        return;
    }

    const existingReservations = [...reservations.value, ...reservationsToCreate.value];
    reservationsToCreate.value.push(
        adjustReservationForOverlaps(activeRequest.value, existingReservations),
    );

    isPopoverVisible.value = false;
    activeRequest.value = null;
};

const onReservationDelete = (reservation: Reservation): void => {
    if (isSaving.value || !canDeleteReservation(reservation)) return;

    const index = reservationsToDelete.value.findIndex((r) => r.id === reservation.id);

    if (index !== -1) {
        reservationsToDelete.value.splice(index, 1);
    } else {
        reservationsToDelete.value.push(reservation);
    }
};

const savePendingChanges = async (): Promise<void> => {
    if (!hasPendingChanges.value || isSaving.value) {
        return;
    }

    isSaving.value = true;

    try {
        const promises: Promise<any>[] = [];

        // Bulk create reservations
        if (reservationsToCreate.value.length > 0) {
            const promise = createReservations({
                locationId: props.location.id,
                requests: reservationsToCreate.value,
            }).then((reservations: Reservation[]) => {
                showProgressDialog.value = true;
                createdReservations.value = reservations;
            });

            promises.push(promise);
        }

        // Bulk delete reservations
        if (reservationsToDelete.value.length > 0) {
            const reservationIds = reservationsToDelete.value.map((r) => r.id);

            promises.push(
                deleteReservations({
                    locationId: props.location.id,
                    reservationIds,
                }),
            );
        }

        await Promise.all(promises);
        await refetchReservations();

        reservationsToCreate.value = [];
        reservationsToDelete.value = [];
    } catch (e) {
        console.error('Error saving reservation changes:', e);
    } finally {
        isSaving.value = false;
    }
};

const onProgressDialogClose = async (): Promise<void> => {
    await refetchReservations();
};

const cancelPendingChanges = (): void => {
    if (isSaving.value) {
        return;
    }

    reservationsToCreate.value = [];
    reservationsToDelete.value = [];
};

// Navigate back when dialog closes
watch(visible, (newVisible) => {
    if (!newVisible) {
        router.push({
            name: 'locations.detail',
            params: { locationId: props.location.id },
        });
    }
});
</script>

<template>
    <Dialog
        class="reservation-dialog"
        v-model:visible="visible"
        modal
        close-on-escape
        dismissable-mask>
        <template #container>
            <!-- Header -->
            <div class="dialog__header">
                <CalendarControls class="w-full" v-model:date="currentWeek" />
            </div>

            <!-- Calendar Content -->
            <div class="calendar-content flex-1 overflow-auto">
                <!-- Loading Overlay -->
                <Transition name="fade">
                    <div v-if="isLoading" class="loading-overlay">
                        <ProgressSpinner style="width: 50px; height: 50px" />
                    </div>
                </Transition>

                <!-- Calendar -->
                <Transition name="fade-in" mode="out-in">
                    <ReservationBuilderCalendar
                        v-if="!isLoading && reservations"
                        :key="currentWeek.toISOString()"
                        :current-week="currentWeek"
                        :opening-times="openings"
                        :reservations="reservations"
                        :reservations-to-create="reservationsToCreate"
                        :reservations-to-delete="reservationsToDelete"
                        :is-saving="isSaving"
                        @click:opening="onOpeningTimeClick"
                        @delete:request="onRequestDelete"
                        @delete:reservation="onReservationDelete">
                    </ReservationBuilderCalendar>
                </Transition>
            </div>

            <!-- Footer -->
            <div class="dialog__footer">
                <ReservationBuilderLegend
                    :has-additions="reservationsToCreate.length > 0"
                    :has-deletions="reservationsToDelete.length > 0">
                </ReservationBuilderLegend>

                <div class="flex items-center gap-2">
                    <template v-if="hasPendingChanges">
                        <Button
                            severity="contrast"
                            text
                            :disabled="isSaving"
                            @click="cancelPendingChanges">
                            <FontAwesomeIcon :icon="faX" />
                            <span>Annuleren</span>
                        </Button>
                        <Button :loading="isSaving" @click="savePendingChanges">
                            <FontAwesomeIcon :icon="faCheck" />
                            <span>Bevestigen</span>
                        </Button>
                    </template>
                    <Button v-else severity="contrast" text @click="visible = false">
                        Sluiten
                    </Button>
                </div>
            </div>
        </template>
    </Dialog>

    <!-- Progress Dialog -->
    <Teleport to="body">
        <ReservationBuilderSubmitDialog
            v-model:visible="showProgressDialog"
            :reservations="progressedCreatedReservations"
            @close="onProgressDialogClose">
        </ReservationBuilderSubmitDialog>
    </Teleport>

    <!-- Reservation Creation Popover -->
    <FloatingPopover :target-ref="popoverTriggerRef" v-model:visible="isPopoverVisible">
        <div class="reservation-popover">
            <h3 class="text-base font-semibold text-gray-900">Nieuwe reservatie</h3>

            <div class="space-y-3">
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Starttijd</label>
                    <TimeInput
                        v-if="activeRequest && activeOpeningTimeSlot"
                        v-model="activeRequest.startTime"
                        :min-time="activeOpeningTimeSlot.startTime"
                        :max-time="activeOpeningTimeSlot.endTime">
                    </TimeInput>
                </div>

                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Eindtijd</label>
                    <TimeInput
                        v-if="activeRequest && activeOpeningTimeSlot"
                        v-model="activeRequest.endTime"
                        :min-time="activeOpeningTimeSlot.startTime"
                        :max-time="activeOpeningTimeSlot.endTime">
                    </TimeInput>
                </div>
            </div>

            <div class="flex justify-end gap-2">
                <Button severity="contrast" text size="small" @click="isPopoverVisible = false">
                    Annuleren
                </Button>
                <Button size="small" @click="onReservationCreate">Toevoegen</Button>
            </div>
        </div>
    </FloatingPopover>
</template>

<style>
@reference '@/assets/styles/main.css';

.reservation-dialog {
    @apply flex h-screen max-h-screen w-screen max-w-[1080px] flex-col md:max-h-[90%];
    @apply rounded-none bg-white md:rounded-xl;

    .dialog__header {
        @apply flex w-full flex-shrink-0 items-center justify-between;
        @apply rounded-t-xl px-4 py-3;
    }

    .dialog__footer {
        @apply flex flex-shrink-0 items-center justify-between rounded-b-xl bg-gray-50 p-4;
        @apply border-t-1 border-slate-200;
    }

    .calendar-content {
        @apply relative;

        .loading-overlay {
            @apply absolute inset-0 z-50;
            @apply flex items-center justify-center;
            @apply bg-white/80 backdrop-blur-sm;
        }
    }
}

.reservation-popover {
    @apply w-80 max-w-[calc(100vw-16px)] space-y-4 rounded-lg bg-white p-4;
}
</style>
