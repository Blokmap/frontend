import { isDateInRange } from '@/utils/date';
import type { Reservation } from './types';

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
