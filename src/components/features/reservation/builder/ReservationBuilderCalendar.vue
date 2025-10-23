<script setup lang="ts">
import OpeningTimeslot from '@/components/features/openings/timeslots/OpeningTimeslot.vue';
import ReservationRequestTimeslot from '@/components/features/reservation/timeslots/ReservationRequestTimeslot.vue';
import ReservationTimeslot from '@/components/features/reservation/timeslots/ReservationTimeslot.vue';
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import { computed } from 'vue';
import { toTimeslots, type TimeSlot } from '@/domain/calendar';
import {
    isOpeningTimeSlot,
    isReservationRequestSlot,
    isReservationSlot,
    type OpeningMetadata,
    type RequestMetadata,
    type ReservationMetadata,
    type SlotMetadata,
} from './index';
import type { OpeningTime } from '@/domain/openings';
import type { Reservation, ReservationRequest } from '@/domain/reservation';

const props = defineProps<{
    currentWeek: Date;
    openingTimes: OpeningTime[];
    reservations: Reservation[];
    reservationsToDelete: Reservation[];
    reservationsToCreate: ReservationRequest[];
    isSaving?: boolean;
}>();

const emit = defineEmits<{
    'click:opening': [slot: TimeSlot<OpeningTime>, event: Event];
    'delete:request': [request: ReservationRequest];
    'delete:reservation': [reservation: Reservation];
}>();

// Opening Time timeslots
const openingTimeSlots = computed<TimeSlot<OpeningMetadata>[]>(() => {
    if (!props.openingTimes) return [];

    const timeslots = toTimeslots(props.openingTimes).map((slot): TimeSlot<OpeningMetadata> => {
        const metadata = { type: 'opening', data: slot.metadata! } as const;

        return {
            ...slot,
            metadata,
        };
    });

    return timeslots;
});

// Existing Reservations timeslots
const reservationTimeSlots = computed((): TimeSlot<ReservationMetadata>[] => {
    if (!props.reservations) return [];

    const timeslots = toTimeslots(props.reservations).map((slot): TimeSlot<ReservationMetadata> => {
        const metadata = { type: 'reservation', data: slot.metadata! } as const;

        return {
            ...slot,
            metadata,
        };
    });

    return timeslots;
});

// Tentative Reservation timeslots
const reservationRequestTimeSlots = computed<TimeSlot<RequestMetadata>[]>(() => {
    if (!props.reservationsToCreate) return [];

    const timeslots = toTimeslots(props.reservationsToCreate).map(
        (slot): TimeSlot<RequestMetadata> => {
            const metadata = { type: 'request', data: slot.metadata! } as const;

            return {
                ...slot,
                metadata,
            };
        },
    );

    return timeslots;
});

// All time slots combined
const allTimeSlots = computed<TimeSlot<SlotMetadata>[]>(() => {
    return [
        ...openingTimeSlots.value,
        ...reservationTimeSlots.value,
        ...reservationRequestTimeSlots.value,
    ];
});

/**
 * Checks if a reservation is pending deletion.
 */
function isPendingDeletion(reservation: Reservation): boolean {
    return props.reservationsToDelete.some((pd) => pd.id === reservation.id);
}

/**
 * Handles click on an opening time slot.
 */
function onOpeningTimeClick(slot: TimeSlot<OpeningMetadata>, event: Event): void {
    if (props.isSaving || !slot.metadata) return;

    const data: TimeSlot<OpeningTime> = {
        ...slot,
        metadata: slot.metadata.data,
    };

    emit('click:opening', data, event);
}

/**
 * Handles deletion of a reservation request.
 */
function onRequestDelete(request: ReservationRequest): void {
    if (props.isSaving) return;
    emit('delete:request', request);
}

/**
 * Handles deletion of a reservation.
 */
function onReservationDelete(reservation: Reservation): void {
    if (props.isSaving) return;
    emit('delete:reservation', reservation);
}
</script>

<template>
    <div class="rounded-lg border border-gray-200">
        <Calendar
            class="h-full"
            :current-week="currentWeek"
            :time-slots="allTimeSlots"
            :enable-dragging="false">
            <template #time-slot="{ slot }">
                <!-- Opening Time Slot -->
                <template v-if="isOpeningTimeSlot(slot)">
                    <OpeningTimeslot
                        :start-time="slot.startTime"
                        :end-time="slot.endTime"
                        @click="onOpeningTimeClick(slot, $event)" />
                </template>

                <!-- Reservation Slot -->
                <template v-else-if="isReservationSlot(slot)">
                    <ReservationTimeslot
                        :start-time="slot.startTime"
                        :end-time="slot.endTime"
                        :reservation="slot.metadata.data"
                        :is-pending-deletion="isPendingDeletion(slot.metadata.data)"
                        :is-saving="isSaving"
                        @delete="onReservationDelete" />
                </template>

                <!-- Reservation Request Slot -->
                <template v-else-if="isReservationRequestSlot(slot)">
                    <ReservationRequestTimeslot
                        :start-time="slot.startTime"
                        :end-time="slot.endTime"
                        :request="slot.metadata.data"
                        :is-saving="isSaving"
                        @delete="onRequestDelete" />
                </template>
            </template>
        </Calendar>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
