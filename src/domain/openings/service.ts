import { formatDate } from '@vueuse/core';
import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { formatFilters } from '@/utils/filter';
import { formatRequest } from '@/utils/service';
import { stringToTime, timeToString } from '@/utils/time';
import type { OpeningTime, OpeningTimeRequest, OpeningTimeFilter } from './types';

/**
 * Parse an opening time object from the API response.
 * Ensures that Date and Time objects are properly formatted.
 *
 * @param openingTimeData - The opening time data from the API.
 * @returns The parsed opening time object with proper types.
 */
export function parseOpeningTime(openingTimeData: any): OpeningTime {
    const reservableFrom = openingTimeData.reservableFrom
        ? new Date(openingTimeData.reservableFrom)
        : null;

    const reservableUntil = openingTimeData.reservableUntil
        ? new Date(openingTimeData.reservableUntil)
        : null;

    return {
        ...openingTimeData,
        day: new Date(openingTimeData.day),
        startTime: stringToTime(openingTimeData.startTime),
        endTime: stringToTime(openingTimeData.endTime),
        createdAt: new Date(openingTimeData.createdAt),
        updatedAt: new Date(openingTimeData.updatedAt),
        reservableFrom,
        reservableUntil,
    };
}

/**
 * Fetch opening times for a specific location and date range.
 *
 * @param locationId - The ID of the location to fetch opening times for.
 * @param filters - The filters to apply when fetching opening times.
 * @returns A promise that resolves to an array of opening times.
 */
export async function readOpeningTimes(
    locationId: number,
    filters: Partial<OpeningTimeFilter> = {},
): Promise<OpeningTime[]> {
    const endpoint = endpoints.locations.openingTimes.listAll.replace(
        '{id}',
        locationId.toString(),
    );

    const params: Record<string, any> = {
        ...formatFilters(filters, ['inWeekOf']),
    };

    const response = await client.get(endpoint, { params });

    return response.data.map(parseOpeningTime);
}

/**
 * Create multiple opening times for a location.
 *
 * @param locationId - The ID of the location to create opening times for.
 * @param openings - The opening times to create.
 * @returns A promise that resolves to an array of created opening times.
 */
export async function createOpeningTimes(
    locationId: number,
    openings: OpeningTimeRequest[],
): Promise<OpeningTime[]> {
    const formatted = openings.map((opening) => formatRequest(opening, ['day', 'endTime']));

    const endpoint = endpoints.locations.openingTimes.createMany.replace(
        '{id}',
        locationId.toString(),
    );

    const response = await client.post(endpoint, formatted);

    return response.data.map(parseOpeningTime);
}

/**
 * Update a single opening time.
 *
 * @param locationId - The ID of the location.
 * @param openingTimeId - The ID of the opening time to update.
 * @param opening - The updated opening time data.
 * @returns A promise that resolves to the updated opening time.
 */
export async function updateOpeningTime(
    locationId: number,
    openingTimeId: number,
    opening: OpeningTimeRequest,
    sequence?: boolean,
): Promise<OpeningTime> {
    const reservableFrom = opening.reservableFrom
        ? formatDate(opening.reservableFrom, 'YYYY-MM-DDTHH:mm:ss')
        : null;

    const reservableUntil = opening.reservableUntil
        ? formatDate(opening.reservableUntil, 'YYYY-MM-DDTHH:mm:ss')
        : null;

    const formatted = {
        ...opening,
        day: formatDate(opening.day, 'YYYY-MM-DD'),
        startTime: timeToString(opening.startTime),
        endTime: timeToString(opening.endTime),
        reservableFrom,
        reservableUntil,
    };

    const endpoint = endpoints.locations.openingTimes.updateOne
        .replace('{id}', locationId.toString())
        .replace('{openingTimeId}', openingTimeId.toString());

    const response = await client.patch(endpoint, formatted, {
        params: { sequence },
    });

    return parseOpeningTime(response.data);
}

/**
 * Delete a single opening time.
 *
 * @param locationId - The ID of the location.
 * @param openingTimeId - The ID of the opening time to delete.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteOpeningTime(
    locationId: number,
    openingTimeId: number,
    sequence?: boolean,
): Promise<void> {
    const endpoint = endpoints.locations.openingTimes.deleteOne
        .replace('{id}', locationId.toString())
        .replace('{openingTimeId}', openingTimeId.toString());

    await client.delete(endpoint, {
        params: { sequence },
    });
}

/**
 * Delete all opening times for a location.
 *
 * @param locationId - The ID of the location to delete opening times for.
 * @returns A promise that resolves when the deletion is complete.
 */
export async function deleteOpeningTimes(locationId: number): Promise<void> {
    const endpoint = endpoints.locations.openingTimes.deleteAll.replace(
        '{id}',
        locationId.toString(),
    );

    await client.delete(endpoint);
}
