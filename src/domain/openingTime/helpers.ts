import type { OpeningTime, OpeningTimeGroupRequest, OpeningTimeRequest } from './types';
import { datesInRange } from '@/utils/date/date';
import { validateTimeRange } from '@/utils/date/time';

export function getOpeningsFromGroup(group: OpeningTimeGroupRequest): OpeningTimeRequest[] {
    const dates = datesInRange(group.startDate, group.endDate);
    const selectedDays = group.selectedDays;
    const results: OpeningTimeRequest[] = [];

    for (const date of dates) {
        // we are europeans >:(
        const day = (date.getDay() + 6) % 7;

        if (selectedDays.includes(day)) {
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
    }

    return results;
}
