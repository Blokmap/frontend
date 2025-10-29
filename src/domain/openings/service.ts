import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { stringToDate } from '@/utils/date';
import { formatFilters } from '@/utils/filter';
import { formatRequest, transformResponseFactory } from '@/utils/service';
import { stringToTime } from '@/utils/time';
import { parseProfileResponse } from '../auth';
import type { OpeningTime, OpeningTimeRequest, OpeningTimeFilter } from './types';

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

    const params = {
        ...formatFilters(filters, ['inWeekOf']),
    };

    const transformResponse = transformResponseFactory(parseOpeningTimeResponse);

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
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
    const endpoint = endpoints.locations.openingTimes.createMany.replace(
        '{id}',
        locationId.toString(),
    );

    const requests = openings.map((opening) => {
        const result = formatRequest(opening, ['day']);

        if (opening.repetition) {
            result.repetition = formatRequest(opening.repetition, ['endDate']);
        }

        return result;
    });

    const transformResponse = transformResponseFactory(parseOpeningTimeResponse);

    const { data } = await client.post(endpoint, requests, {
        transformResponse,
    });

    return data;
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
    const endpoint = endpoints.locations.openingTimes.updateOne
        .replace('{id}', locationId.toString())
        .replace('{openingTimeId}', openingTimeId.toString());

    const request = {
        ...formatRequest(opening, ['day']),
    };

    const transformResponse = transformResponseFactory(parseOpeningTimeResponse);

    const { data } = await client.patch(endpoint, request, {
        params: { sequence },
        transformResponse,
    });

    return data;
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
