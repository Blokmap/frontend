import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { Reservation } from '@/types/schema/Reservation';
import { formatIncludes } from '@/utils/service';
import { formatDate } from '@vueuse/core';

export type ReservationIncludes = 'profile' | 'location' | 'openingTime' | 'confirmedBy';

/**
 * Function to parse a reservation object. Used to ensure that API responses
 * are correctly formatted with Date objects.
 *
 * @param {Reservation} reservation - The reservation object to parse.
 * @returns {Reservation} The parsed reservation object with Date fields converted.
 */
function parseReservation(reservation: Reservation): Reservation {
    return {
        ...reservation,
        startTime: new Date(reservation.startTime),
        endTime: new Date(reservation.endTime),
        confirmedAt: reservation.confirmedAt ? new Date(reservation.confirmedAt) : null,
        createdAt: new Date(reservation.createdAt),
        updatedAt: new Date(reservation.updatedAt),
    };
}

/**
 * Function to get reservations for a specific profile on a given date.
 *
 * @param {number} profileId - The ID of the profile to fetch reservations for.
 * @param {Date} [dateOfWeek] - The date for which to fetch reservations. Defaults to today.
 * @returns {Promise<Reservation[]>} A promise that resolves to an array of reservations.
 */
export async function getProfileReservations(
    profileId: number,
    dateOfWeek?: Date,
    includes: ReservationIncludes[] = [],
): Promise<Reservation[]> {
    const endpoint = endpoints.profiles.reservations.list.replace('{id}', profileId.toString());

    const params: Record<string, any> = {
        profile: true,
        ...formatIncludes(includes),
    };

    if (dateOfWeek !== undefined) {
        params.date = formatDate(dateOfWeek, 'YYYY-MM-DD');
    }

    const response = await client.get(endpoint, { params });

    return response.data.map(parseReservation);
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
