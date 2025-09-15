import { isDateInRange, startOfDay } from '@/utils/date/date';

import type { Reservation } from './types';
import type { TimeSlot } from '@/domain/openings';

/**
 * Filter reservations by date range
 *
 * @param reservations - Array of reservations to filter.
 * @param startDate - Start date of the range.
 * @param endDate - End date of the range.
 * @returns Filtered array of reservations that fall within the specified date range.
 */
export function filterReservationsByDateRange(
    reservations: Reservation[],
    startDate: Date,
    endDate: Date,
): Reservation[] {
    return reservations.filter((reservation) => {
        const reservationDate = reservation.day;
        return isDateInRange(reservationDate, startDate, endDate);
    });
}

/**
 * Convert a reservation to a calendar time slot
 *
 * @param reservation - The reservation to convert.
 * @returns A TimeSlot object representing the reservation.
 */
export function reservationToTimeSlot(reservation: Reservation): TimeSlot<Reservation> {
    return {
        id: `reservation-${reservation.id}`,
        day: startOfDay(reservation.day),
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        metadata: reservation,
    };
}

/**
 * Convert multiple reservations to time slots, optionally filtered by date range
 *
 * @param reservations - Array of reservations to convert.
 * @param startDate - Start date of the range.
 * @param endDate - End date of the range.
 * @returns Array of TimeSlot objects representing the reservations.
 */
export function reservationsToTimeSlots(
    reservations?: Reservation[],
    startDate?: Date,
    endDate?: Date,
): TimeSlot<Reservation>[] {
    if (!reservations) return [];

    let filteredReservations = reservations;

    if (startDate && endDate) {
        filteredReservations = filterReservationsByDateRange(reservations, startDate, endDate);
    }

    return filteredReservations.map(reservationToTimeSlot);
}
