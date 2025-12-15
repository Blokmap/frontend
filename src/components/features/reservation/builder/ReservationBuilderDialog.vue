<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import ReservationBuilderCalendar from '@/components/features/reservation/builder/ReservationBuilderCalendar.vue';
import ReservationBuilderLegend from '@/components/features/reservation/builder/ReservationBuilderLegend.vue';
import ReservationBuilderPopover from '@/components/features/reservation/builder/ReservationBuilderPopover.vue';
import ReservationBuilderSubmitDialog from '@/components/features/reservation/builder/ReservationBuilderSubmitDialog.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
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
    type ReservationRequest,
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
const reservationsToCreate = ref<ReservationRequest[]>([]);
const reservationsToDelete = ref<Reservation[]>([]);

// Popover state
const popoverTriggerRef = ref<HTMLElement | null>(null);
const isPopoverVisible = ref(false);

const activeRequest = ref<ReservationRequest | null>(null);
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

    // Toggle popover visibility
    const shouldClosePopover =
        isPopoverVisible.value && popoverTriggerRef.value === event.currentTarget;

    if (shouldClosePopover) {
        isPopoverVisible.value = false;
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

const onRequestDelete = (request: ReservationRequest): void => {
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
            <div class="calendar-content">
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
                        :location="location"
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
                            size="small"
                            :disabled="isSaving"
                            @click="cancelPendingChanges"
                            text>
                            <FontAwesomeIcon :icon="faX" />
                            <span>Annuleren</span>
                        </Button>
                        <Button :loading="isSaving" @click="savePendingChanges" size="small">
                            <FontAwesomeIcon :icon="faCheck" />
                            <span>Bevestigen</span>
                        </Button>
                    </template>
                    <Button v-else severity="contrast" text @click="visible = false" size="small">
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
    <ReservationBuilderPopover
        :target-ref="popoverTriggerRef"
        v-model:visible="isPopoverVisible"
        :request="activeRequest"
        :opening-time-slot="activeOpeningTimeSlot"
        @create="onReservationCreate"
        @cancel="isPopoverVisible = false">
    </ReservationBuilderPopover>
</template>

<style>
@reference '@/assets/styles/main.css';

.reservation-dialog {
    @apply flex h-screen max-h-screen w-screen max-w-[1080px] flex-col md:max-h-[90%];
    @apply rounded-none bg-white md:rounded-xl;

    .dialog__header {
        @apply flex w-full items-center justify-between;
        @apply rounded-t-xl px-4 py-3;
    }

    .dialog__footer {
        @apply flex flex-col items-center justify-between gap-4 p-4 md:flex-row;
        @apply rounded-b-xl border-t-1 border-slate-200 bg-gray-50;
    }

    .calendar-content {
        @apply relative flex flex-1 border-t border-slate-100;
        @apply min-h-0;

        .loading-overlay {
            @apply absolute inset-0 z-50;
            @apply flex items-center justify-center;
            @apply bg-white/80 backdrop-blur-sm;
        }
    }
}
</style>
