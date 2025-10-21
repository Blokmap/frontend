import type { TimeSlot } from '@/domain/calendar';
import type { OpeningTime } from '@/domain/openings';
import type { Reservation, ReservationRequest } from '@/domain/reservation';

export type OpeningMetadata = { type: 'opening'; data: OpeningTime };
export type ReservationMetadata = { type: 'reservation'; data: Reservation };
export type RequestMetadata = { type: 'request'; data: ReservationRequest };

export type SlotMetadata = OpeningMetadata | ReservationMetadata | RequestMetadata;

export function isOpeningTimeSlot(
    slot: TimeSlot<SlotMetadata>,
): slot is TimeSlot<OpeningMetadata> & { metadata: OpeningMetadata } {
    return slot.metadata?.type === 'opening';
}

export function isReservationSlot(
    slot: TimeSlot<SlotMetadata>,
): slot is TimeSlot<ReservationMetadata> & { metadata: ReservationMetadata } {
    return slot.metadata?.type === 'reservation';
}

export function isReservationRequestSlot(
    slot: TimeSlot<SlotMetadata>,
): slot is TimeSlot<RequestMetadata> & { metadata: RequestMetadata } {
    return slot.metadata?.type === 'request';
}
