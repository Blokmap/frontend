import { isDateInPast } from '@/utils/date';
import type { Reservation } from '../types';
import type { OpeningTime } from '@/domain/openings';

/**
 * Check if an opening time is at full occupancy based on reservation count.
 *
 * @param opening - The opening time to check.
 * @param defaultSeatCount - Default seat count if not specified in opening.
 * @returns True if the opening is at full occupancy, false otherwise.
 */
export function isOpeningAtFullOccupancy(opening: OpeningTime, defaultSeatCount: number): boolean {
    if (!opening.stats) {
        return false;
    }

    return opening.stats.reservationCount >= (opening.seatCount ?? defaultSeatCount);
}

/**
 * Check if an opening time is currently reservable based on reservableFrom and reservableUntil.
 *
 * @param opening - The opening time to check.
 * @returns True if the opening is currently reservable, false otherwise.
 */
export function isOpeningReservable(opening: OpeningTime): boolean {
    const now = new Date();

    if (opening.reservableFrom && now < opening.reservableFrom) {
        return false;
    }

    if (opening.reservableUntil && now > opening.reservableUntil) {
        return false;
    }

    return true;
}

/**
 * Check if an opening time can be interacted with (not in past, not full, reservable).
 *
 * @param opening - The opening time to check.
 * @param defaultSeatCount - Default seat count if not specified in opening.
 * @returns True if the opening can be interacted with, false otherwise.
 */
export function canInteractWithOpening(opening: OpeningTime, defaultSeatCount: number): boolean {
    if (isDateInPast(opening.day)) return false;
    if (isOpeningAtFullOccupancy(opening, defaultSeatCount)) return false;
    if (!isOpeningReservable(opening)) return false;
    return true;
}

/**
 * Check if a reservation can be deleted (must not be in the past).
 *
 * @param reservation - The reservation to check.
 * @returns True if the reservation can be deleted, false otherwise.
 */
export function canDeleteReservation(reservation: Reservation): boolean {
    return !isDateInPast(reservation.day);
}
