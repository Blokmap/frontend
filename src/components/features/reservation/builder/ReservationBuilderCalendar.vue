<script setup lang="ts">
import OpeningTimeslot from '@/components/features/openings/timeslots/OpeningTimeslot.vue';
import ReservationRequestTimeslot from '@/components/features/reservation/timeslots/ReservationRequestTimeslot.vue';
import ReservationTimeslot from '@/components/features/reservation/timeslots/ReservationTimeslot.vue';
import Calendar from '@/components/shared/molecules/calendar/Calendar.vue';
import { computed } from 'vue';
import { toTimeslots, type TimeSlot } from '@/domain/calendar';
import { canInteractWithOpening, canDeleteReservation } from '@/domain/reservation';
import OpeningHistogram from '../../openings/timeslots/OpeningHistogram.vue';
import {
    isOpeningTimeSlot,
    isReservationRequestSlot,
    isReservationSlot,
    isHistogramSlot,
    type OpeningMetadata,
    type RequestMetadata,
    type ReservationMetadata,
    type HistogramMetadata,
    type SlotMetadata,
} from './index';
import type { Location } from '@/domain/location';
import type { OpeningTime } from '@/domain/openings';
import type { Reservation, ReservationRequest } from '@/domain/reservation';

const props = defineProps<{
    currentWeek: Date;
    location: Location;
    openingTimes: OpeningTime[];
    reservations: Reservation[];
    reservationsToDelete: Reservation[];
    reservationsToCreate: ReservationRequest[];
    isSaving?: boolean;
}>();

const emit = defineEmits<{
    'click:opening': [slot: TimeSlot<OpeningTime>, event: Event, timeRef: HTMLElement];
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

// Histogram timeslots (rendered on top)
const histogramTimeSlots = computed<TimeSlot<HistogramMetadata>[]>(() => {
    if (!props.openingTimes) return [];

    const timeslots = toTimeslots(props.openingTimes).map((slot): TimeSlot<HistogramMetadata> => {
        const metadata = { type: 'histogram', data: slot.metadata! } as const;

        return {
            ...slot,
            metadata,
        };
    });

    return timeslots;
});

// All time slots combined
const allTimeSlots = computed<TimeSlot<SlotMetadata>[]>(() => {
    // Note: the order here determines the rendering order (bottom to top)
    // Histogram slots should be on top
    return [
        ...openingTimeSlots.value,
        ...reservationTimeSlots.value,
        ...reservationRequestTimeSlots.value,
        ...histogramTimeSlots.value,
    ];
});

const isPendingDeletion = (reservation: Reservation): boolean => {
    return props.reservationsToDelete.some((pd) => pd.id === reservation.id);
};

const isOpeningDisabled = (slot: TimeSlot<OpeningMetadata>): boolean => {
    if (!slot.metadata) {
        return true;
    }

    const opening = slot.metadata.data;
    const defaultSeatCount = props.location.seatCount;

    return !canInteractWithOpening(opening, defaultSeatCount);
};

const onOpeningTimeClick = (
    slot: TimeSlot<OpeningMetadata>,
    event: Event,
    timeRef: HTMLElement,
): void => {
    if (props.isSaving || !slot.metadata || isOpeningDisabled(slot)) return;

    const data: TimeSlot<OpeningTime> = {
        ...slot,
        metadata: slot.metadata.data,
    };

    emit('click:opening', data, event, timeRef);
};

const onRequestDelete = (request: ReservationRequest): void => {
    if (props.isSaving) return;
    emit('delete:request', request);
};

const onReservationDelete = (reservation: Reservation): void => {
    if (props.isSaving || !canDeleteReservation(reservation)) return;
    emit('delete:reservation', reservation);
};
</script>

<template>
    <Calendar :current-week="currentWeek" :time-slots="allTimeSlots" :enable-dragging="false">
        <template #time-slot="{ slot }">
            <!-- Histogram Slot (rendered on top) -->
            <template v-if="isHistogramSlot(slot)">
                <OpeningHistogram
                    :bin-count="100"
                    :seat-count="slot.metadata.data.seatCount ?? location.seatCount"
                    :stats="slot.metadata.data.stats!">
                </OpeningHistogram>
            </template>

            <!-- Opening Time Slot -->
            <template v-if="isOpeningTimeSlot(slot)">
                <OpeningTimeslot
                    :start-time="slot.startTime"
                    :end-time="slot.endTime"
                    :disabled="isOpeningDisabled(slot)"
                    @click="(event, ref) => onOpeningTimeClick(slot, event, ref)">
                </OpeningTimeslot>
            </template>

            <!-- Reservation Slot -->
            <template v-else-if="isReservationSlot(slot)">
                <ReservationTimeslot
                    :start-time="slot.startTime"
                    :end-time="slot.endTime"
                    :reservation="slot.metadata.data"
                    :pending-deletion="isPendingDeletion(slot.metadata.data)"
                    :disabled="!canDeleteReservation(slot.metadata.data)"
                    :saving="isSaving"
                    @delete="onReservationDelete">
                </ReservationTimeslot>
            </template>

            <!-- Reservation Request Slot -->
            <template v-else-if="isReservationRequestSlot(slot)">
                <ReservationRequestTimeslot
                    :start-time="slot.startTime"
                    :end-time="slot.endTime"
                    :request="slot.metadata.data"
                    :is-saving="isSaving"
                    @delete="onRequestDelete">
                </ReservationRequestTimeslot>
            </template>
        </template>
    </Calendar>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
