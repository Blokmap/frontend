import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { formatRequest, transformResponse } from '@/utils/service';
import { type Time } from '@/utils/time';
import type { Reservation, ReservationRequest } from './types';

export type ReservationIncludes = 'profile' | 'location' | 'openingTime' | 'confirmedBy';

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

    const request = formatRequest({
        startTime,
        endTime,
    });

    const { data } = await client.post(endpoint, request, {
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
    request: Partial<ReservationRequest>,
): Promise<Reservation> {
    const endpoint = endpoints.reservations.update.replace('{id}', reservationId.toString());

    const { data } = await client.patch(endpoint, request, {
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

    const { data } = await client.post(endpoint, {
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

    const request = requests.map((d) => formatRequest(d));

    const { data } = await client.post(endpoint, request, {
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
