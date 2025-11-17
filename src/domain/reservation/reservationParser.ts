import { parseLocationResponse } from '@/domain/location';
import { parseOpeningTimeResponse } from '@/domain/openings';
import { parseProfileResponse } from '@/domain/profile';
import { stringToDate } from '@/utils/date';
import { stringToTime } from '@/utils/time';
import type { Reservation } from './types';

/**
 * Parses a Reservation response object.
 *
 * @param data - The raw reservation data from the API.
 * @returns The parsed Reservation object.
 */
export function parseReservationResponse(data: any): Reservation {
    const result: Reservation = {
        ...data,
        day: stringToDate(data.day),
        startTime: stringToTime(data.startTime),
        endTime: stringToTime(data.endTime),
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
    };

    if (data.createdBy) {
        result.createdBy = parseProfileResponse(data.createdBy);
    }

    if (data.location) {
        result.location = parseLocationResponse(data.location);
    }

    if (data.openingTime) {
        result.openingTime = parseOpeningTimeResponse(data.openingTime);
    }

    return result;
}
