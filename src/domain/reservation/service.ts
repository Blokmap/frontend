import { formatDate } from '@vueuse/core';
import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { stringToTime, timeToString, type Time } from '@/utils/time';
import type { Reservation } from './types';

export type ReservationIncludes = 'profile' | 'location' | 'openingTime' | 'confirmedBy';

/**
 * Parse a reservation object. Used to ensure that API responses
 * are correctly formatted with Date objects and Time objects.
 *
 * @param {any} reservationData - The reservation data from the API.
 * @returns {Reservation} The parsed reservation object with proper types.
 */
export function parseReservation(reservationData: any): Reservation {
    return {
        ...reservationData,
        startTime: stringToTime(reservationData.startTime),
        endTime: stringToTime(reservationData.endTime),
        day: new Date(reservationData.day),
        confirmedAt: reservationData.confirmedAt ? new Date(reservationData.confirmedAt) : null,
        createdAt: new Date(reservationData.createdAt),
        updatedAt: new Date(reservationData.updatedAt),
    };
}

/**
 * Serialize a reservation object for API requests.
 *
 * @param {Reservation} reservation - The reservation object to serialize.
 * @returns {any} The serialized reservation data for the API.
 */
export function serializeReservation(reservation: Reservation): any {
    return {
        ...reservation,
        startTime: timeToString(reservation.startTime),
        endTime: timeToString(reservation.endTime),
        day: formatDate(reservation.day, 'YYYY-MM-DD'),
    };
}

/**
 * Get reservations for a specific location on a given date.
 *
 * @param {number} locationId - The ID of the location to fetch reservations for.
 * @param {Date} [dateOfWeek] - The date for which to fetch reservations. Defaults to today.
 * @returns {Promise<Reservation[]>} A promise that resolves to an array of reservations.
 */
export async function getLocationReservations(
    locationId: number,
    dateOfWeek?: Date,
): Promise<Reservation[]> {
    const endpoint = endpoints.locations.reservations.list.replace('{id}', locationId.toString());
    const params: Record<string, any> = {};

    if (dateOfWeek !== undefined) {
        params.date = formatDate(dateOfWeek, 'YYYY-MM-DD');
    }

    const response = await client.get(endpoint, { params });

    return response.data.map(parseReservation);
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

    const body = {
        startTime: timeToString(startTime),
        endTime: timeToString(endTime),
    };

    const response = await client.post(endpoint, body);

    return parseReservation(response.data);
}

/**
 * Delete a reservation.
 *
 * @param locationId - The ID of the location.
 * @param openingTimeId - The ID of the opening time.
 * @param reservationId - The ID of the reservation to delete.
 * @returns A promise that resolves when the reservation is deleted.
 */
export async function deleteReservation(
    locationId: number,
    openingTimeId: number,
    reservationId: number,
): Promise<void> {
    const endpoint = endpoints.locations.openingTimes.reservations.delete
        .replace('{id}', locationId.toString())
        .replace('{openingTimeId}', openingTimeId.toString())
        .replace('{reservationId}', reservationId.toString());

    await client.delete(endpoint);
}
