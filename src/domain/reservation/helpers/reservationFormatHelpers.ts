import { timeToString } from '@/utils/time';
import type { Reservation } from '../types';

/**
 * Format reservation date into a human-readable string.
 *
 * @param reservation - The reservation object.
 * @returns Formatted string representing the reservation's date.
 */
export function formatReservationDate(reservation: Reservation): string {
    return reservation.day.toDateString();
}

/**
 * Format reservation time range into a human-readable string.
 *
 * @param reservation - The reservation object.
 * @returns Formatted string representing the reservation's time range.
 */
export function formatReservationTimeRange(reservation: Reservation): string {
    const startTimeString = timeToString(reservation.startTime);
    const endTimeString = timeToString(reservation.endTime);
    return `${startTimeString} - ${endTimeString}`;
}

/**
 * Format reservation date and time into a human-readable string.
 *
 * @param reservation - The reservation object.
 * @returns Formatted string representing the reservation's date and time.
 */
export function formatReservationDateTime(reservation: Reservation): string {
    const dateString = formatReservationDate(reservation);
    const timeRangeString = formatReservationTimeRange(reservation);
    return `${dateString}, ${timeRangeString}`;
}
