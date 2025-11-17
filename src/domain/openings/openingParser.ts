import { parseProfileResponse } from '@/domain/profile';
import { stringToDate } from '@/utils/date';
import { stringToTime } from '@/utils/time';
import type { OpeningTime } from './types';

/**
 * Parses an OpeningTime response object.
 *
 * @param data - The raw opening time data from the API.
 * @returns The parsed OpeningTime object.
 */
export function parseOpeningTimeResponse(data: any): OpeningTime {
    const result: OpeningTime = {
        ...data,
        day: stringToDate(data.day),
        reservableFrom: stringToDate(data.reservableFrom),
        reservableUntil: stringToDate(data.reservableUntil),
        startTime: stringToTime(data.startTime),
        endTime: stringToTime(data.endTime),
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
    };

    if (data.createdBy) {
        result.createdBy = parseProfileResponse(data.createdBy);
    }

    if (data.updatedBy) {
        result.updatedBy = parseProfileResponse(data.updatedBy);
    }

    return result;
}
