import { WEEKDAY_DAYS } from '@/domain/calendar/constants';
import { datesInRange } from '@/utils/date';
import { timeToMinutes, type Time } from '@/utils/time';
import type { OpeningTimeRequest, OpeningTime } from '../types';

export * from './builder';

/**
 * Generates opening times based on a repetition configuration.
 *
 * @param group - The base opening time request with repetition config.
 * @returns An array of generated opening time requests.
 */
export function getOpeningsFromRepetition(group: OpeningTimeRequest): OpeningTimeRequest[] {
    if (!group.repetition) return [group];

    const dates = datesInRange(group.day, group.repetition.endDate);
    const selectedDays =
        group.repetition.selectedDays.length > 0 ? group.repetition.selectedDays : WEEKDAY_DAYS;

    const results: OpeningTimeRequest[] = [];

    for (const date of dates) {
        // we are europeans >:(
        const day = (date.getDay() + 6) % 7;

        if (!selectedDays.includes(day)) {
            continue;
        }

        results.push({
            sequenceId: group.sequenceId,
            startTime: group.startTime,
            endTime: group.endTime,
            day: date,
            seatCount: group.seatCount,
            reservableFrom: null,
            reservableUntil: null,
        });
    }

    return results;
}

/**
 * Groups opening times by day of the week.
 *
 * @param openingTimes - Array of opening times to group.
 * @returns Map with day key (toDateString) and array of opening times for that day.
 */
export function groupOpeningTimesByDay(openingTimes: OpeningTime[]): Map<string, OpeningTime[]> {
    const grouped = new Map<string, OpeningTime[]>();

    openingTimes.forEach((opening) => {
        const dayKey = opening.day.toDateString();
        if (!grouped.has(dayKey)) {
            grouped.set(dayKey, []);
        }
        grouped.get(dayKey)!.push(opening);
    });

    grouped.forEach((times) => {
        times.sort((a, b) => {
            const aMinutes = a.startTime.hours * 60 + a.startTime.minutes;
            const bMinutes = b.startTime.hours * 60 + b.startTime.minutes;
            return aMinutes - bMinutes;
        });
    });

    return grouped;
}

/**
 * Gets opening times for a specific day from grouped opening times.
 *
 * @param groupedTimes - Map of grouped opening times by day.
 * @param day - The day to get opening times for.
 * @returns Array of opening times for the specified day.
 */
export function getOpeningTimesForDay(
    groupedTimes: Map<string, OpeningTime[]>,
    day: Date,
): OpeningTime[] {
    return groupedTimes.get(day.toDateString()) || [];
}

/**
 * Checks if two opening times overlap.
 *
 * @param a - The first opening time.
 * @param b - The second opening time.
 * @returns True if the opening times overlap, false otherwise.
 */
export function isOverlapping(
    a: { startTime: Time; endTime: Time; day: Date },
    b: { startTime: Time; endTime: Time; day: Date },
): boolean {
    if (a.day.toDateString() !== b.day.toDateString()) {
        return false;
    }

    const aStart = timeToMinutes(a.startTime);
    const aEnd = timeToMinutes(a.endTime);
    const bStart = timeToMinutes(b.startTime);
    const bEnd = timeToMinutes(b.endTime);

    return aStart < bEnd && bStart < aEnd;
}

/**
 * Converts an OpeningTime to an OpeningTimeRequest.
 *
 * @param opening - The opening time to convert.
 * @returns The corresponding opening time request.
 */
export function openingToRequest(opening: OpeningTime): OpeningTimeRequest {
    return {
        id: opening.id,
        day: opening.day,
        startTime: opening.startTime,
        endTime: opening.endTime,
        seatCount: opening.seatCount,
        reservableFrom: opening.reservableFrom,
        reservableUntil: opening.reservableUntil,
        sequenceId: opening.sequenceId,
    };
}
