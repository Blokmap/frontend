<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Popover from 'primevue/popover';
import ProgressSpinner from 'primevue/progressspinner';
import ReservationBuilderCalendar from '@/components/features/reservation/builder/ReservationBuilderCalendar.vue';
import ReservationBuilderLegend from '@/components/features/reservation/builder/ReservationBuilderLegend.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import TimeInput from '@/components/shared/molecules/form/TimeInput.vue';
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watch, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import {
    useCreateReservations,
    useDeleteReservations,
    useReadProfileReservations,
} from '@/composables/data/useReservations';
import { useWebsocket } from '@/composables/data/useWebsocket';
import { useToast } from '@/composables/store/useToast';
import { type Reservation, type ReservationBody } from '@/domain/reservation';
import {
    WebsocketChannelName,
    WebsocketMessageEvent,
    type WebsocketMessage,
} from '@/domain/websocket';
import { minutesToTime, timeToMinutes, doTimeRangesOverlap } from '@/utils/time';
import type { TimeSlot } from '@/domain/calendar';
import type { Location } from '@/domain/location';
import type { OpeningTime } from '@/domain/openings';

const props = defineProps<{
    location: Location;
    openings: OpeningTime[];
}>();

const visible = defineModel<boolean>('visible', { required: true });
const currentWeek = defineModel<Date>('date', { required: true });

const router = useRouter();
const toast = useToast();
const i18n = useI18n();

const { profileId } = useAuthProfile();

const reservationFilters = computed(() => ({
    inWeekOf: currentWeek.value,
    locationId: props.location.id,
}));

const {
    data: reservations,
    isPending: isLoadingReservations,
    refetch: refetchReservations,
} = useReadProfileReservations(profileId, reservationFilters);

const { mutateAsync: createReservations } = useCreateReservations({
    disableToasts: true,
});
const { mutateAsync: deleteReservations } = useDeleteReservations();

const { subscribe } = useWebsocket(computed(() => visible.value && props.location.isReservable));

watch(
    [visible, profileId],
    ([isVisible, currentProfileId]) => {
        if (isVisible && currentProfileId) {
            const unsubscribe = subscribe(
                {
                    name: WebsocketChannelName.Reservations,
                    meta: { profileId: currentProfileId },
                },
                (message: WebsocketMessage<any>) => {
                    if (message.event === WebsocketMessageEvent.ReservationCreated) {
                        toast.add({
                            severity: 'success',
                            summary: i18n.t('components.reservation.created.title'),
                            detail: i18n.t('components.reservation.created.message'),
                        });
                    }

                    if (message.event === WebsocketMessageEvent.ReservationError) {
                        toast.add({
                            severity: 'warn',
                            summary: i18n.t('components.reservation.rejected.title'),
                            detail: i18n.t('components.reservation.rejected.message'),
                        });
                    }

                    if (message.event === WebsocketMessageEvent.ReservationError) {
                        toast.add({
                            severity: 'error',
                            summary: i18n.t('components.reservation.error.title'),
                            detail: i18n.t('components.reservation.error.message'),
                        });
                    }
                },
            );

            return () => {
                unsubscribe();
            };
        }
    },
    { immediate: true },
);

// Builder state
const reservationsToCreate = ref<ReservationBody[]>([]);
const reservationsToDelete = ref<Reservation[]>([]);

// Popover state
const reservationPopover = useTemplateRef('reservationPopover');
const activeRequest = ref<ReservationBody | null>(null);
const activeOpeningTimeSlot = ref<TimeSlot<OpeningTime> | null>(null);

const isSaving = ref<boolean>(false);
const isLoading = computed<boolean>(() => isLoadingReservations.value);

const hasPendingChanges = computed(
    () => reservationsToCreate.value.length + reservationsToDelete.value.length > 0,
);

/**
 * Handle click on an opening time slot
 *
 * @param slot - The clicked time slot
 * @param event - The click event
 */
function onOpeningTimeClick(slot: TimeSlot<OpeningTime>, event: Event): void {
    if (isSaving.value || !slot.metadata) return;

    // Store the opening time slot for min/max constraints
    activeOpeningTimeSlot.value = slot;

    // Show popover to create new reservation
    activeRequest.value = {
        day: slot.metadata.day,
        openingTimeId: slot.metadata.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
    };

    reservationPopover.value?.toggle(event);
}

/**
 * Handle deletion of a tentative reservation request
 */
function onRequestDelete(request: ReservationBody): void {
    if (isSaving.value) return;

    const index = reservationsToCreate.value.findIndex((r) => r === request);

    if (index !== -1) {
        reservationsToCreate.value.splice(index, 1);
    }
}

/**
 * Handle creation of a new reservation
 */
function onReservationCreate(): void {
    if (!activeRequest.value) return;

    const request = { ...activeRequest.value };
    const reqStart = timeToMinutes(request.startTime);
    const reqEnd = timeToMinutes(request.endTime);

    const overlaps = [...(reservations.value || []), ...reservationsToCreate.value]
        .filter((r) => {
            const isSameDay = r.day === request.day;

            const overlaps = doTimeRangesOverlap(
                request.startTime,
                request.endTime,
                r.startTime,
                r.endTime,
            );

            return isSameDay && overlaps;
        })
        .map((r) => ({ start: timeToMinutes(r.startTime), end: timeToMinutes(r.endTime) }));

    if (overlaps.length) {
        let finalStart = reqStart;
        let finalEnd = reqEnd;

        // Adjust start if covered by a conflict
        const startConflict = overlaps.find((r) => finalStart >= r.start && finalStart < r.end);
        if (startConflict) finalStart = startConflict.end;

        // Adjust end if there's a conflict after the (possibly adjusted) start
        const endConflict = overlaps.find((r) => r.start >= finalStart && r.start < finalEnd);
        if (endConflict) finalEnd = endConflict.start;

        request.startTime = minutesToTime(finalStart);
        request.endTime = minutesToTime(finalEnd);
    }

    reservationsToCreate.value.push(request);

    reservationPopover.value?.hide();
    activeRequest.value = null;
}

/**
 * Handles deletion of a reservation.
 *
 * @param reservation - The reservation to delete
 */
function onReservationDelete(reservation: Reservation): void {
    if (isSaving.value) return;

    const index = reservationsToDelete.value.findIndex((r) => r.id === reservation.id);

    if (index !== -1) {
        reservationsToDelete.value.splice(index, 1);
    } else {
        reservationsToDelete.value.push(reservation);
    }
}

/**
 * Save all pending changes (creations and deletions)
 */
async function savePendingChanges(): Promise<void> {
    if (!hasPendingChanges.value || isSaving.value) return;

    isSaving.value = true;

    try {
        const promises: Promise<any>[] = [];

        // Bulk create reservations
        if (reservationsToCreate.value.length > 0) {
            promises.push(
                createReservations({
                    locationId: props.location.id,
                    requests: reservationsToCreate.value,
                }),
            );
        }

        // Bulk delete reservations
        if (reservationsToDelete.value.length > 0) {
            promises.push(
                deleteReservations({
                    locationId: props.location.id,
                    reservationIds: reservationsToDelete.value.map((r) => r.id),
                }),
            );
        }

        await Promise.all(promises);

        // Refetch reservations to get the updated data
        await refetchReservations();

        // Reset pending changes after refetch completes
        reservationsToCreate.value = [];
        reservationsToDelete.value = [];
    } catch (e) {
        console.error('Error saving reservation changes:', e);
    } finally {
        isSaving.value = false;
    }
}

/**
 * Cancel all pending changes and reset state
 */
function cancelPendingChanges(): void {
    if (isSaving.value) return;
    reservationsToCreate.value = [];
    reservationsToDelete.value = [];
}

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
            <div class="flex-1 overflow-auto">
                <!-- Loading State -->
                <div v-if="isLoading" class="flex h-full items-center justify-center">
                    <ProgressSpinner style="width: 50px; height: 50px" />
                </div>

                <!-- Calendar -->
                <ReservationBuilderCalendar
                    v-else-if="openings && reservations"
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

    <!-- Reservation Creation Popover -->
    <Popover ref="reservationPopover">
        <div class="w-80 space-y-4 p-4">
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
                <Button severity="contrast" text size="small" @click="reservationPopover?.hide()">
                    Annuleren
                </Button>
                <Button size="small" @click="onReservationCreate">Toevoegen</Button>
            </div>
        </div>
    </Popover>
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
}
</style>
