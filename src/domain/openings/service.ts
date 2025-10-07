import { formatDate } from '@vueuse/core';
import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { stringToTime } from '@/utils/time';
import type { OpeningTime } from './types';

/**
 * Parse an opening time object from the API response.
 * Ensures that Date and Time objects are properly formatted.
 *
 * @param openingTimeData - The opening time data from the API.
 * @returns The parsed opening time object with proper types.
 */
export function parseOpeningTime(openingTimeData: any): OpeningTime {
    return {
        ...openingTimeData,
        day: new Date(openingTimeData.day),
        startTime: stringToTime(openingTimeData.startTime),
        endTime: stringToTime(openingTimeData.endTime),
        reservableFrom: openingTimeData.reservableFrom
            ? new Date(openingTimeData.reservableFrom)
            : null,
        reservableUntil: openingTimeData.reservableUntil
            ? new Date(openingTimeData.reservableUntil)
            : null,
        createdAt: new Date(openingTimeData.createdAt),
        updatedAt: new Date(openingTimeData.updatedAt),
    };
}

/**
 * Fetch opening times for a specific location and date range.
 *
 * @param locationId - The ID of the location to fetch opening times for.
 * @param dateInWeek - The date within the week for which to fetch opening times.
 * @returns A promise that resolves to an array of opening times.
 */
export async function getLocationOpeningTimes(
    locationId: number,
    dateInWeek?: Date,
): Promise<OpeningTime[]> {
    const endpoint = endpoints.locations.openingTimes.listAll.replace(
        '{id}',
        locationId.toString(),
    );

    const params: Record<string, any> = {};

    if (dateInWeek !== undefined) {
        params.inWeekOf = formatDate(dateInWeek, 'YYYY-MM-DD');
    }

    const response = await client.get(endpoint, { params });

    return response.data.map(parseOpeningTime);
}
