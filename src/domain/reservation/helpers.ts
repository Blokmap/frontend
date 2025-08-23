import type { Reservation } from './types';
import type { CalendarTimeSlot } from '@/types/Calendar';
import { isDateInRange, startOfDay } from '@/utils/date/date';
import { calculateDuration, dateToTime } from '@/utils/date/time';

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
        const reservationDate = new Date(reservation.startTime);
        return isDateInRange(reservationDate, startDate, endDate);
    });
}

/**
 * Convert a reservation to a calendar time slot
 *
 * @param reservation - The reservation to convert.
 * @returns A TimeSlot object representing the reservation.
 */
export function reservationToTimeSlot(reservation: Reservation): CalendarTimeSlot<Reservation> {
    const startTime = new Date(reservation.startTime);
    const endTime = new Date(reservation.endTime);

    const startTimeString = dateToTime(startTime);
    const endTimeString = dateToTime(endTime);

    // Calculate duration using time utility
    const duration = calculateDuration(startTime, endTime);

    return {
        id: `reservation-${reservation.id}`,
        day: startOfDay(startTime),
        startTime: startTimeString,
        endTime: endTimeString,
        duration,
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
): CalendarTimeSlot<Reservation>[] {
    if (!reservations) return [];

    let filteredReservations = reservations;

    if (startDate && endDate) {
        filteredReservations = filterReservationsByDateRange(reservations, startDate, endDate);
    }

    return filteredReservations.map(reservationToTimeSlot);
}
