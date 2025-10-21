import { formatDate } from '@vueuse/core';
import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { stringToDate } from '@/utils/date';
import { stringToTime, timeToString, type Time } from '@/utils/time';
import type { Reservation, ReservationRequest } from './types';

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
        day: stringToDate(reservationData.day, true),
        confirmedAt: stringToDate(reservationData.confirmedAt, true),
        createdAt: stringToDate(reservationData.createdAt, true),
        updatedAt: stringToDate(reservationData.updatedAt, true),
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
export async function deleteReservation(reservationId: number): Promise<void> {
    const endpoint = endpoints.reservations.delete.replace('{id}', reservationId.toString());

    await client.delete(endpoint);
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
    reservationId: number,
): Promise<Reservation> {
    const endpoint = endpoints.locations.reservations.confirm
        .replace('{id}', locationId.toString())
        .replace('{reservationId}', reservationId.toString());

    const response = await client.post(endpoint);

    return parseReservation(response.data);
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

    const body = requests.map((request) => ({
        openingTimeId: request.openingTimeId,
        startTime: timeToString(request.startTime),
        endTime: timeToString(request.endTime),
    }));

    const response = await client.post(endpoint, body);

    return response.data.map(parseReservation);
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
    reservationIds: number[],
): Promise<void> {
    const endpoint = endpoints.locations.reservations.delete.replace('{id}', locationId.toString());

    await client.delete(endpoint, { data: reservationIds });
}
