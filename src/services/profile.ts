import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { Profile, ProfileStats } from '@/domain/profile';
import type { Reservation } from '@/domain/reservation';
import { type ReservationIncludes, parseReservation } from '@/services/reservation';
import { stringToDate } from '@/utils/date/date';
import { formatIncludes } from '@/utils/service';
import { formatDate } from '@vueuse/core';

/**
 * Parse a profile object from the API by converting string dates to Date objects
 *
 * @param profileData - The raw profile data from the API
 * @returns The parsed profile object
 */
export function parseProfile(profileData: any | null): Profile {
    return {
        ...profileData,
        createdAt: stringToDate(profileData.createdAt),
    };
}

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

/**
 * Updates the profile avatar for a given profile ID.
 *
 * @param profileId - The ID of the profile to update the avatar for.
 * @param file - The file to upload as the new avatar.
 * @returns A promise that resolves when the avatar is updated.
 */
export async function updateProfileAvatar(profileId: number, file: File): Promise<void> {
    const url = endpoints.profiles.avatar.replace('{id}', String(profileId));
    const formData = new FormData();
    formData.append('image', file);

    await client.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

/**
 * Updates the profile details for a given profile ID.
 *
 * @param profileId - The ID of the profile to update.
 * @param profileData - The profile data to update.
 * @returns A promise that resolves to the updated profile.
 */
export async function updateProfile(
    profileId: number,
    profileData: Partial<Profile>,
): Promise<Profile> {
    const url = endpoints.profiles.update.replace('{id}', String(profileId));
    const response = await client.patch<any>(url, profileData);
    return parseProfile(response.data);
}

/**
 * Deletes the profile avatar for a given profile ID.
 *
 * @param profileId - The ID of the profile to delete the avatar for.
 * @returns A promise that resolves when the avatar is deleted.
 */
export async function deleteProfileAvatar(profileId: number): Promise<void> {
    const url = endpoints.profiles.avatar.replace('{id}', String(profileId));
    await client.delete(url);
}
