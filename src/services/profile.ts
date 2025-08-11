import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import { type ReservationIncludes, parseReservation } from '@/services/reservation';
import type { ProfileStats } from '@/types/schema/Profile';
import type { Reservation } from '@/types/schema/Reservation';
import { formatIncludes } from '@/utils/service';
import { formatDate } from '@vueuse/core';

/**
 * Fetches the profile statistics for a given profile ID.
 *
 * @param profileId - The ID of the profile to fetch statistics for.
 * @returns A promise that resolves to the profile statistics.
 */
export async function getProfileStats(profileId: number): Promise<ProfileStats> {
    const url = endpoints.profiles.stats.replace('{id}', String(profileId));
    const response = await client.get<ProfileStats>(url);
    return response.data;
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
        params.inWeekOf = formatDate(dateOfWeek, 'YYYY-MM-DD');
    }

    const response = await client.get(endpoint, { params });

    return response.data.map(parseReservation);
}
