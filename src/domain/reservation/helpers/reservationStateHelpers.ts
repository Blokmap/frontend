import { ReservationState, type Reservation } from '../types';

/**
 * Get the full Date object for a reservation's start time.
 *
 * @param reservation - The reservation object.
 * @returns Date object representing the reservation's start date and time.
 */
export function getReservationDateTime(reservation: Reservation): Date {
    const date = new Date(reservation.day);
    date.setHours(reservation.startTime.hours, reservation.startTime.minutes, 0, 0);
    return date;
}

/**
 * Check if a reservation is in the future.
 *
 * @param reservation - The reservation object.
 * @returns True if the reservation is in the future, false otherwise.
 */
export function isReservationInFuture(reservation: Reservation): boolean {
    return getReservationDateTime(reservation) > new Date();
}

/**
 * Check if a reservation can be cancelled.
 * A reservation is cancellable if it is in the future and has a state of Created or Pending.
 *
 * @param reservation - The reservation object.
 * @returns True if the reservation is cancellable, false otherwise.
 */
export function isReservationCancellable(reservation: Reservation): boolean {
    return (
        isReservationInFuture(reservation) &&
        (reservation.state === ReservationState.Created ||
            reservation.state === ReservationState.Pending)
    );
}
