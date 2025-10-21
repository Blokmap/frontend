<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Popover from 'primevue/popover';
import ProgressSpinner from 'primevue/progressspinner';
import ReservationBuilderCalendar from '@/components/features/reservation/builder/ReservationBuilderCalendar.vue';
import ReservationBuilderLegend from '@/components/features/reservation/builder/ReservationBuilderLegend.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import TimeInput from '@/components/shared/molecules/form/TimeInput.vue';
import { computed, ref, watch, useTemplateRef } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadOpeningTimes } from '@/composables/data/useOpeningTimes';
import { useReadProfileReservations } from '@/composables/data/useProfile';
import { useCreateReservations, useDeleteReservations } from '@/composables/data/useReservations';
import { useWebsocket } from '@/composables/data/useWebsocket';
import { useToast } from '@/composables/store/useToast';
import type { TimeSlot } from '@/domain/calendar';
import type { Location } from '@/domain/location';
import type { OpeningTime } from '@/domain/openings';
import type {
    Reservation,
    ReservationQueueResponse,
    ReservationRequest,
} from '@/domain/reservation';

const props = defineProps<{
    location: Location;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const currentWeek = defineModel<Date>('date', { required: true });

const router = useRouter();
const toast = useToast();

const { profileId } = useAuthProfile();

// WebSocket connection for real-time updates
const websocketChannel = computed(() => {
    const id = profileId.value;
    if (!id) return null;
    return {
        profileId: id,
        tag: 'reservations',
    };
});

useWebsocket<ReservationQueueResponse>(websocketChannel, (data: ReservationQueueResponse) => {
    if (data.state === 'error') {
        toast.add({
            severity: 'error',
            summary: 'Fout bij verwerken reservatie',
            detail: `Er is een fout opgetreden bij het verwerken van je reservatie (ID: ${data.reservationId}).`,
        });
    }
});

const reservationFilters = computed(() => ({
    inWeekOf: currentWeek.value,
    locationId: props.location.id,
}));

const openingFilters = computed(() => ({
    inWeekOf: currentWeek.value,
}));

const {
    data: reservations,
    isPending: isLoadingReservations,
    refetch: refetchReservations,
} = useReadProfileReservations(profileId, reservationFilters);

const { data: openings, isPending: isLoadingOpenings } = useReadOpeningTimes(
    computed(() => props.location.id),
    openingFilters,
);

const { mutateAsync: createReservations } = useCreateReservations();
const { mutateAsync: deleteReservations } = useDeleteReservations();

// Builder state
const reservationsToCreate = ref<ReservationRequest[]>([]);
const reservationsToDelete = ref<Reservation[]>([]);

// Popover state
const reservationPopover = useTemplateRef('reservationPopover');
const activeRequest = ref<ReservationRequest | null>(null);
const activeOpeningTimeSlot = ref<TimeSlot<OpeningTime> | null>(null);

const isSaving = ref<boolean>(false);
const isLoading = computed<boolean>(() => isLoadingReservations.value || isLoadingOpenings.value);

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
function onRequestDelete(request: ReservationRequest): void {
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

    reservationsToCreate.value.push({ ...activeRequest.value });

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

        toast.add({
            severity: 'success',
            summary: 'Wijzigingen opgeslagen',
            detail: `Wijziging(en) succesvol opgeslagen.`,
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij opslaan',
            detail: 'Er is een fout opgetreden bij het opslaan van je wijzigingen.',
        });
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
    <Dialog v-model:visible="visible" modal :closable="false" class="dialog">
        <template #header>
            <!-- Calendar Controls -->
            <CalendarControls class="w-full" v-model:date="currentWeek" />
        </template>

        <div class="space-y-6">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-12">
                <ProgressSpinner />
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

        <template #footer>
            <ReservationBuilderLegend
                class="mr-auto"
                :has-additions="reservationsToCreate.length > 0"
                :has-deletions="reservationsToDelete.length > 0">
            </ReservationBuilderLegend>

            <template v-if="hasPendingChanges">
                <div class="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-1.5 text-sm">
                    <span v-if="reservationsToCreate.length > 0" class="flex items-center gap-1">
                        <span class="font-semibold text-green-700">
                            +{{ reservationsToCreate.length }}
                        </span>
                    </span>
                    <span v-if="reservationsToDelete.length > 0" class="flex items-center gap-1">
                        <span class="font-semibold text-red-700">
                            -{{ reservationsToDelete.length }}
                        </span>
                    </span>
                </div>
                <Button severity="contrast" text :disabled="isSaving" @click="cancelPendingChanges">
                    Annuleren
                </Button>
                <Button :loading="isSaving" @click="savePendingChanges"> Opslaan </Button>
            </template>
            <Button v-else severity="contrast" text @click="visible = false">Sluiten</Button>
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

.dialog {
    @apply h-full w-full max-w-[1240px];
}
</style>
