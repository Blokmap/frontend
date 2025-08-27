import { WEEKDAY_DAYS } from './constants';
import type { OpeningTimeGroupRequest, OpeningTimeRequest } from './types';
import type { OpeningTime } from './types';
import type { TimeSlot } from '@/domain/openings';
import { datesInRange } from '@/utils/date/date';
import { minutesToTime, timeToMinutes, validateTimeRange } from '@/utils/date/time';
import { timeToCompactString, timeToString } from '@/utils/date/time';

export function getOpeningsFromGroup(group: OpeningTimeGroupRequest): OpeningTimeRequest[] {
    const dates = datesInRange(group.startDate, group.endDate);
    const selectedDays = group.type === 'daily' ? WEEKDAY_DAYS : group.selectedDays;

    const results = [];

    for (const date of dates) {
        // we are europeans >:(
        const day = (date.getDay() + 6) % 7;

        if (!selectedDays.includes(day)) continue;

        for (const timeslot of group.timeSlots) {
            const correctedTimes = validateTimeRange(timeslot.startTime, timeslot.endTime);
            results.push({
                startTime: correctedTimes.startTime,
                endTime: correctedTimes.endTime,
                day: date,
                seatCount: timeslot.seatCount,
                reservableFrom: null,
                reservableUntil: null,
            });
        }
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

    // Sort times for each day
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
 * Formats an opening time range string.
 *
 * @param opening - The opening time object.
 * @param compact - Whether to use compact format (e.g., "8u-17u" vs "08:00 - 17:00").
 * @returns Formatted time range string.
 */
export function formatOpeningTimeRange(opening: OpeningTime, compact = false): string {
    if (compact) {
        return `${timeToCompactString(opening.startTime)}-${timeToCompactString(opening.endTime)}`;
    }
    return `${timeToString(opening.startTime)} - ${timeToString(opening.endTime)}`;
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
