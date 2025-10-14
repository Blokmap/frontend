import { isDateInRange, startOfDay, datesInRange } from '@/utils/date';
import type { TimeSlot, TimeSlottable } from '../types';
import type { OpeningTime, OpeningTimeRequest } from '@/domain/openings';
import type { Reservation } from '@/domain/reservation';

/**
 * Convert a TimeSlottable object to a TimeSlot, optionally attaching metadata.
 * @param timeslottable - A TimeSlottable object containing day, startTime, and endTime.
 */
export function toTimeslot<T extends TimeSlottable = TimeSlottable>(timeslottable: T): TimeSlot<T> {
    const { day, startTime, endTime } = timeslottable;

    return {
        metadata: timeslottable,
        day,
        startTime,
        endTime,
    };
}

/**
 * Convert an array of TimeSlottable objects to TimeSlot objects.
 * @param timeslottables - An array of TimeSlottable objects.
 */
export function toTimeslots<T extends TimeSlottable = TimeSlottable>(
    timeslottables: T[],
): TimeSlot<T>[] {
    return timeslottables.map(toTimeslot);
}

/**
 * Convert an array of OpeningTimeRequest objects to TimeSlot objects.
 * @param openingRequests - An array of OpeningTimeRequest objects.
 */
export function openingRequestsToTimeSlots(
    openingRequests: OpeningTimeRequest[],
): TimeSlot<OpeningTimeRequest>[] {
    const repetitions = openingRequests.filter((t) => !!t.repetition);

    const timeslots: TimeSlot<OpeningTimeRequest>[] = openingRequests
        .filter((t) => !t.repetition)
        .map(toTimeslot);

    for (const opening of repetitions) {
        const { startTime, endTime, repetition } = opening;
        const { selectedDays, endDate } = repetition!;

        const range = datesInRange(new Date(), endDate).filter((d) =>
            selectedDays.includes((d.getDay() + 6) % 7),
        );

        for (const day of range) {
            timeslots.push({
                metadata: opening,
                startTime,
                endTime,
                day,
            });
        }
    }

    return timeslots;
}

/**
 * Convert opening times to time slots for calendar display, optionally filtered by date range.
 *
 * @param openingTimes - Array of opening times to convert.
 * @param startDate - Optional start date to filter opening times.
 * @param endDate - Optional end date to filter opening times.
 * @returns Array of TimeSlot objects representing the opening times.
 */
export function openingTimesToTimeSlots(
    openingTimes: OpeningTime[],
    startDate?: Date,
    endDate?: Date,
): TimeSlot<OpeningTime>[] {
    let filteredOpeningTimes = openingTimes;

    if (startDate && endDate) {
        filteredOpeningTimes = openingTimes.filter((ot) =>
            isDateInRange(ot.day, startDate, endDate),
        );
    }

    return filteredOpeningTimes.map((openingTime) => ({
        id: `opening-${openingTime.id}`,
        day: startOfDay(openingTime.day),
        startTime: openingTime.startTime,
        endTime: openingTime.endTime,
        metadata: openingTime,
    }));
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
        filteredReservations = reservations.filter((reservation) =>
            isDateInRange(reservation.day, startDate, endDate),
        );
    }

    return filteredReservations.map(reservationToTimeSlot);
}
