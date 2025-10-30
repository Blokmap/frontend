import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { stringToDate } from '@/utils/date';
import { formatFilters } from '@/utils/filter';
import { formatIncludes, formatRequest, transformResponseFactory } from '@/utils/service';
import { stringToTime, type Time } from '@/utils/time';
import { parseProfileResponse } from '../auth';
import { parseLocationResponse } from '../location';
import { parseOpeningTimeResponse } from '../openings';
import type { Reservation, ReservationRequest, ReservationFilter } from './types';

// Defines which related data can be included when fetching reservations
export type ReservationIncludes = 'profile' | 'location' | 'openingTime' | 'confirmedBy';

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

/**
 * Create a reservation for a specific opening time.
 *
 * @param locationId - The ID of the location.
 * @param openingTimeId - The ID of the opening time.
 * @param startTime - The start time of the reservation.
 * @param endTime - The end time of the reservation.
 * @returns A promise that resolves to the created reservation.
 */
export async function createReservation(
    locationId: number,
    openingTimeId: number,
    startTime: Time,
    endTime: Time,
): Promise<Reservation> {
    const endpoint = endpoints.locations.openingTimes.reservations.create
        .replace('{id}', locationId.toString())
        .replace('{openingTimeId}', openingTimeId.toString());

    const body = formatRequest({
        startTime,
        endTime,
    });

    const transformResponse = transformResponseFactory(parseReservationResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Delete a reservation.
 *
 * @param locationId - The ID of the location.
 * @param openingTimeId - The ID of the opening time.
 * @param reservationId - The ID of the reservation to delete.
 * @returns A promise that resolves when the reservation is deleted.
 */
export async function deleteReservation(reservationId: string): Promise<void> {
    const endpoint = endpoints.reservations.delete.replace('{id}', reservationId.toString());

    await client.delete(endpoint);
}

/**
 * Update a reservation.
 *
 * @param reservationId - The ID of the reservation to update.
 * @returns A promise that resolves to the updated reservation.
 */
export async function updateReservation(
    reservationId: string,
    body: Partial<ReservationRequest>,
): Promise<Reservation> {
    const endpoint = endpoints.reservations.update.replace('{id}', reservationId.toString());

    const transformResponse = transformResponseFactory(parseReservationResponse);

    const { data } = await client.patch(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Confirm a reservation.
 *
 * @param locationId - The ID of the location.
 * @param reservationId - The ID of the reservation to confirm.
 * @returns A promise that resolves to the confirmed reservation.
 */
export async function confirmReservation(
    locationId: number,
    reservationId: string,
): Promise<Reservation> {
    const endpoint = endpoints.locations.reservations.confirm
        .replace('{id}', locationId.toString())
        .replace('{reservationId}', reservationId.toString());

    const transformResponse = transformResponseFactory(parseReservationResponse);

    const { data } = await client.post(endpoint, null, {
        transformResponse,
    });

    return data;
}

/**
 * Bulk create reservations for a location.
 *
 * @param locationId - The ID of the location.
 * @param requests - Array of reservation requests with openingTimeId, startTime, and endTime.
 * @returns A promise that resolves to an array of created reservations.
 */
export async function createReservations(
    locationId: number,
    requests: ReservationRequest[],
): Promise<Reservation[]> {
    const endpoint = endpoints.locations.reservations.create.replace('{id}', locationId.toString());

    const body = requests.map((d) => formatRequest(d));

    const transformResponse = transformResponseFactory(parseReservationResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Bulk delete reservations for a location.
 *
 * @param locationId - The ID of the location.
 * @param reservationIds - Array of reservation IDs to delete.
 * @returns A promise that resolves when all reservations are deleted.
 */
export async function deleteReservations(
    locationId: number,
    reservationIds: string[],
): Promise<void> {
    const endpoint = endpoints.locations.reservations.delete.replace('{id}', locationId.toString());

    await client.delete(endpoint, { data: reservationIds });
}

/**
 * Get reservations for a specific profile on a given date.
 *
 * @param {number} profileId - The ID of the profile to fetch reservations for.
 * @param {ReservationFilter} filter - The filters to apply when fetching reservations.
 * @returns {Promise<Reservation[]>} A promise that resolves to an array of reservations.
 */
export async function readProfileReservations(
    profileId: string,
    filter: Partial<ReservationFilter> = {},
    reservationIncludes: ReservationIncludes[] = [],
): Promise<Reservation[]> {
    const endpoint = endpoints.profiles.reservations.list.replace('{id}', profileId.toString());

    const params = {
        reservationIncludes,
        ...formatFilters(filter, ['inWeekOf']),
    };

    const transformResponse = transformResponseFactory(parseReservationResponse);

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
}

/**
 * Get reservations for a specific location.
 *
 * @param locationId - The ID of the location to fetch reservations for.
 * @param filters - The filters to apply when fetching reservations.
 * @param includes - The related data to include in the response.
 * @returns A promise that resolves to an array of reservations.
 */
export async function readLocationReservations(
    locationId: number,
    filters: Partial<ReservationFilter> = {},
    reservationIncludes: ReservationIncludes[] = [],
): Promise<Reservation[]> {
    const endpoint = endpoints.locations.reservations.list.replace('{id}', locationId.toString());

    const params = {
        reservationIncludes,
        ...formatFilters(filters, ['inWeekOf', 'day']),
    };

    const transformResponse = transformResponseFactory(parseReservationResponse);

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
}
