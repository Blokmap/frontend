<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import CalendarControls from '@/components/shared/molecules/calendar/CalendarControls.vue';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { formatDate } from '@vueuse/core';
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadProfileReservations } from '@/composables/data/useProfile';
import {
    useCreateReservation,
    useDeleteReservation,
    type CreateReservationParams,
    type DeleteReservationParams,
} from '@/composables/data/useReservations';
import { useToast } from '@/composables/store/useToast';
import { openingTimesToTimeSlots, reservationsToTimeSlots } from '@/domain/calendar/helpers';
import { endOfWeek, startOfWeek } from '@/utils/date';
import { timeToString } from '@/utils/time';
import type { TimeSlot } from '@/domain/calendar';
import type { Location } from '@/domain/location';
import type { OpeningTime } from '@/domain/openings';
import type { Reservation } from '@/domain/reservation';

const props = defineProps<{
    location: Location;
}>();

const visible = defineModel<boolean>('visible', { required: true });
const currentWeek = defineModel<Date>('date', { required: true });

const router = useRouter();
const toast = useToast();

const { profileId } = useAuthProfile();

const { data: allReservations, isPending: isLoadingReservations } = useReadProfileReservations(
    profileId,
    currentWeek,
);

const { mutate: createReservation, isPending: isCreating } = useCreateReservation({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Reservering aangemaakt',
            detail: 'Je reservering is succesvol aangemaakt.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout',
            detail: 'Er is een fout opgetreden bij het aanmaken van je reservering.',
        });
    },
});

const { mutate: deleteReservation, isPending: isDeleting } = useDeleteReservation({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Reservering verwijderd',
            detail: 'Je reservering is succesvol verwijderd.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout',
            detail: 'Er is een fout opgetreden bij het verwijderen van je reservering.',
        });
    },
});

const weekStart = computed(() => startOfWeek(currentWeek.value));
const weekEnd = computed(() => endOfWeek(currentWeek.value));

const myReservations = computed(() => {
    if (!allReservations.value || !profileId.value) return [];
    return allReservations.value.filter((r: Reservation) => r.location?.id === props.location.id);
});

const openingTimeSlots = computed(() => {
    const openingTimes = props.location.openingTimes;
    if (!openingTimes) return [];
    return openingTimesToTimeSlots(openingTimes, weekStart.value, weekEnd.value);
});

const reservationTimeSlots = computed((): TimeSlot<Reservation>[] => {
    if (!myReservations.value) return [];
    return reservationsToTimeSlots(myReservations.value, weekStart.value, weekEnd.value);
});

const allTimeSlots = computed((): TimeSlot<OpeningTime | Reservation>[] => {
    return [...openingTimeSlots.value, ...reservationTimeSlots.value];
});

const isLoading = computed(() => isLoadingReservations.value);
const isMutating = computed(() => isCreating.value || isDeleting.value);

/**
 *  Handle opening time slot click
 */
function onOpeningTimeClick(slot: TimeSlot<OpeningTime>): void {
    const openingTime = slot.metadata;

    if (!openingTime) return;
    if (isMutating.value) return;

    const params: CreateReservationParams = {
        locationId: props.location.id,
        openingTimeId: openingTime.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
    };

    createReservation(params);
}

/**
 * Handle reservation deletion
 */
function onReservationDelete(reservation: Reservation): void {
    if (isMutating.value || !reservation.openingTime) return;

    const params: DeleteReservationParams = {
        locationId: props.location.id,
        openingTimeId: reservation.openingTime.id,
        reservationId: reservation.id,
    };

    deleteReservation(params);
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

// Update URL when week changes
watch(currentWeek, (newWeek) => {
    const dateString = formatDate(newWeek, 'YYYY-MM-DD');
    router.replace({
        name: 'locations.reservation',
        params: { locationId: props.location.id },
        query: { week: dateString },
    });
});
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        :draggable="false"
        :closable="true"
        class="w-full max-w-7xl">
        <template #header>
            <h2 class="text-xl font-semibold text-gray-900">
                Reserveer een spot voor {{ props.location.name }}
            </h2>
        </template>

        <div class="space-y-6">
            <!-- Calendar Controls -->
            <CalendarControls v-model:date="currentWeek" />

            <!-- Loading State -->
            <div v-if="isLoading" class="flex items-center justify-center py-12">
                <ProgressSpinner />
            </div>

            <!-- Calendar -->
            <div v-else class="rounded-lg border border-gray-200">
                <Calendar
                    class="h-full"
                    :current-week="currentWeek"
                    :time-slots="allTimeSlots"
                    :enable-dragging="false">
                    <template #time-slot="{ slot }">
                        <!-- Opening Time Slot -->
                        <div
                            v-if="slot.metadata && 'seatCount' in slot.metadata"
                            class="opening-time-card"
                            @click="onOpeningTimeClick(slot)">
                            <div class="time-display">
                                <span class="time-text">
                                    {{ timeToString(slot.startTime) }}-{{
                                        timeToString(slot.endTime)
                                    }}
                                </span>
                            </div>
                        </div>

                        <!-- Reservation Slot -->
                        <!-- Reservation Slot -->
                        <div
                            v-else-if="slot.metadata && 'state' in slot.metadata"
                            class="reservation-card">
                            <Button
                                rounded
                                class="delete-btn"
                                size="small"
                                severity="contrast"
                                :disabled="isMutating"
                                @click.stop="onReservationDelete(slot.metadata)"
                                text>
                                <template #icon>
                                    <FontAwesomeIcon :icon="faTrash" class="h-3 w-3" />
                                </template>
                            </Button>
                            <div class="time-display">
                                <span class="time-text">
                                    {{ timeToString(slot.startTime) }}-{{
                                        timeToString(slot.endTime)
                                    }}
                                </span>
                            </div>
                        </div>
                    </template>
                </Calendar>
            </div>
        </div>

        <!-- Legend -->
        <template #footer>
            <div class="flex w-full items-center gap-6 rounded-lg bg-gray-50 p-4">
                <div class="flex items-center gap-2">
                    <div class="h-4 w-4 rounded border-l-4 border-slate-400 bg-slate-200"></div>
                    <span class="text-sm text-gray-700">Beschikbaar</span>
                </div>
                <div class="flex items-center gap-2">
                    <div class="h-4 w-4 rounded border-l-4 border-green-500 bg-green-100"></div>
                    <span class="text-sm text-gray-700">Jouw reservering</span>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.opening-time-card {
    @apply relative h-full bg-slate-100;
    @apply flex justify-center;
    @apply p-2;
    @apply cursor-pointer;
    @apply border-1 border-transparent;

    &:hover {
        @apply border-slate-400;
    }

    .time-display {
        @apply text-slate-700;
    }
}

.reservation-card {
    @apply bg-primary-100 relative h-full;
    @apply p-2;
    @apply border-1 border-transparent;
    @apply flex items-center justify-center;

    .time-display {
        @apply text-primary-700;
        @apply flex items-center justify-center;
    }

    .delete-btn {
        @apply !absolute top-1 right-1 z-10;
        @apply text-primary-700;
    }
}

.time-display {
    @apply flex items-center justify-center text-center;

    .time-text {
        @apply text-xs font-semibold;
    }
}
</style>
