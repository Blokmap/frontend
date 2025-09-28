import { datesInRange } from '@/utils/date/date';
import { timeToMinutes, type Time } from '@/utils/date/time';
import { WEEKDAY_DAYS } from './constants';
import type { OpeningTime, OpeningTimeRequest } from './types';
import type { TimeSlot } from '@/domain/openings';

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
            sequenceNumber: group.sequenceNumber,
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
 * Convert an opening time to a calendar time slot
 *
 * @param openingTime - The opening time to convert.
 * @param index - The index of the opening time in the array.
 * @returns A TimeSlot object representing the opening time.
 */
export function openingTimeToTimeSlot(
    openingTime: OpeningTimeRequest,
    index: number,
): TimeSlot<{ openingTime: OpeningTimeRequest; index: number }> {
    return {
        id: `opening-time-${index}-${openingTime.day.getTime()}-${timeToMinutes(openingTime.startTime)}`,
        day: new Date(openingTime.day),
        startTime: openingTime.startTime,
        endTime: openingTime.endTime,
        metadata: { openingTime, index },
    };
}

/**
 * Convert multiple opening times to time slots
 *
 * @param openingTimes - Array of opening times to convert.
 * @returns Array of TimeSlot objects representing the opening times.
 */
export function openingTimesToTimeSlots(
    openingTimes: OpeningTimeRequest[],
): TimeSlot<{ openingTime: OpeningTimeRequest; index: number }>[] {
    return openingTimes.map((ot, index) => openingTimeToTimeSlot(ot, index));
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
export function areOpeningTimesOverlapping(
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
