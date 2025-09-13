import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { Reservation } from '@/domain/reservation';
import { stringToTime, timeToString } from '@/utils/date/time';
import { formatDate } from '@vueuse/core';

export type ReservationIncludes = 'profile' | 'location' | 'openingTime' | 'confirmedBy';

/**
 * Function to parse a reservation object. Used to ensure that API responses
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
 * Function to serialize a reservation object for API requests.
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
 * Function to get reservations for a specific location on a given date.
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
