import { startOfDay, datesInRange } from '@/utils/date';
import type { TimeSlot, TimeSlottable } from '../types';
import type { OpeningTimeRequest } from '@/domain/openings';

/**
 * Convert a TimeSlottable object to a TimeSlot, optionally attaching metadata.
 * @param timeslottable - A TimeSlottable object containing day, startTime, and endTime.
 */
export function toTimeslot<T extends TimeSlottable = TimeSlottable>(timeslottable: T): TimeSlot<T> {
    const { day, startTime, endTime } = timeslottable;

    return {
        metadata: timeslottable,
        day: startOfDay(day),
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
 * Needs custom implementation to handle repetitions.
 *
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
