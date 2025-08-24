import { WEEKDAY_DAYS } from './constants';
import type { OpeningTimeGroupRequest, OpeningTimeRequest } from './types';
import type { TimeSlot } from '@/types/Calendar';
import { datesInRange } from '@/utils/date/date';
import { minutesToTime, timeToMinutes, validateTimeRange } from '@/utils/date/time';

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
