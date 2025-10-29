import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { parseReservation } from '@/domain/reservation';
import { dateToString, stringToDate } from '@/utils/date';
import { formatFilters } from '@/utils/filter';
import {
    createFormDataRequest,
    formatIncludes,
    transformPaginatedResponse,
    transformResponse,
} from '@/utils/service';
import { timeToString } from '@/utils/time';
import { parseAuthority, type Authority } from '../authority';
import { parseLocation, type Location } from '../location';
import type { Profile, ProfileStats, ProfileFilter, ProfileScanRequest } from './types';
import type { Reservation, ReservationFilter, ReservationIncludes } from '@/domain/reservation';
import type { Paginated } from '@/utils/pagination';

/**
 * Parse a profile object from the API by converting string dates to Date objects
 *
 * @param profileData - The raw profile data from the API
 * @returns The parsed profile object
 */
export function parseProfile(profileData: any | null): Profile {
    return {
        ...profileData,
        createdAt: stringToDate(profileData.createdAt, true),
    };
}

/**
 * Fetches the profile statistics for a given profile ID.
 *
 * @param profileId - The ID of the profile to fetch statistics for.
 * @returns A promise that resolves to the profile statistics.
 */
export async function readProfileStats(profileId: string): Promise<ProfileStats> {
    const endpoint = endpoints.profiles.stats.replace('{id}', String(profileId));

    const { data } = await client.get<ProfileStats>(endpoint);

    return data;
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
    includes: ReservationIncludes[] = [],
): Promise<Reservation[]> {
    const endpoint = endpoints.profiles.reservations.list.replace('{id}', profileId.toString());

    const params = {
        ...formatFilters(filter, ['inWeekOf']),
        ...formatIncludes(includes),
    };

    const { data } = await client.get(endpoint, {
        params,
        transformResponse: transformResponse(parseReservation),
    });

    return data;
}

/**
 * Updates the profile avatar for a given profile ID.
 *
 * @param profileId - The ID of the profile to update the avatar for.
 * @param file - The file to upload as the new avatar.
 * @returns A promise that resolves when the avatar is updated.
 */
export async function updateProfileAvatar(profileId: string, file: File): Promise<void> {
    const endpoint = endpoints.profiles.avatar.replace('{id}', String(profileId));
    const data = createFormDataRequest({ image: file });

    await client.post(endpoint, data, {
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
    profileId: string,
    profileData: Partial<Profile>,
): Promise<Profile> {
    const endpoint = endpoints.profiles.update.replace('{id}', String(profileId));

    const { data } = await client.patch<any>(endpoint, profileData, {
        transformResponse: transformResponse(parseProfile),
    });

    return data;
}

/**
 * Deletes the profile avatar for a given profile ID.
 *
 * @param profileId - The ID of the profile to delete the avatar for.
 * @returns A promise that resolves when the avatar is deleted.
 */
export async function deleteProfileAvatar(profileId: string): Promise<void> {
    const endpoint = endpoints.profiles.avatar.replace('{id}', String(profileId));
    await client.delete(endpoint);
}

/**
 * Fetch a profile by its ID.
 *
 * @param profileId - The ID of the profile to fetch.
 * @returns A promise that resolves to the fetched profile.
 */
export async function readProfile(profileId: string): Promise<Profile> {
    const endpoint = endpoints.profiles.read.replace('{id}', String(profileId));

    const { data } = await client.get<any>(endpoint, {
        transformResponse: transformResponse(parseProfile),
    });

    return data;
}

/**
 * Read profiles with optional filters (admin endpoint, returns paginated list).
 *
 * @param filters - The filters to apply when reading profiles.
 * @returns A promise that resolves to a paginated list of profiles.
 */
export async function readProfiles(
    filters: Partial<ProfileFilter> = {},
): Promise<Paginated<Profile>> {
    const endpoint = endpoints.admin.profiles.list;

    const { data } = await client.get(endpoint, {
        params: filters,
        transformResponse: transformPaginatedResponse(parseProfile),
    });

    return data;
}

/**
 * Block a profile to prevent it from accessing the application.
 *
 * @param profileId - The ID of the profile to block.
 * @returns A promise that resolves to the blocked profile.
 */
export async function blockProfile(profileId: string): Promise<Profile> {
    const endpoint = endpoints.profiles.block.replace('{id}', profileId.toString());

    const { data } = await client.post(
        endpoint,
        {},
        {
            transformResponse: transformPaginatedResponse(parseProfile),
        },
    );

    return data;
}

/**
 * Unblock a profile to restore its access to the application.
 *
 * @param profileId - The ID of the profile to unblock.
 * @returns A promise that resolves to the unblocked profile.
 */
export async function unblockProfile(profileId: string): Promise<Profile> {
    const endpoint = endpoints.profiles.unblock.replace('{id}', profileId.toString());

    const { data } = await client.post(
        endpoint,
        {},
        {
            transformResponse: transformResponse(parseProfile),
        },
    );

    return data;
}

/**
 * Initiates a scan for the specified profile.
 *
 * @param profileId - The ID of the profile to scan.
 * @returns A promise that resolves when the scan is initiated.
 */
export async function scanProfile(
    profileId: string,
    request: ProfileScanRequest,
): Promise<Reservation[]> {
    const body = {
        ...request,
        day: dateToString(request.day, true),
        time: timeToString(request.time),
    };

    const { data } = await client.post(
        endpoints.profiles.scan.replace('{id}', profileId.toString()),
        body,
        {
            transformResponse: transformResponse(parseReservation),
        },
    );

    return data;
}

/**
 * Fetches the locations associated with a specific profile.
 *
 * @param profileId - The ID of the profile whose locations are to be fetched.
 * @returns A promise that resolves to a paginated list of locations.
 */
export async function readProfileLocations(profileId: string): Promise<Location[]> {
    const endpoint = endpoints.profiles.locations.list.replace('{id}', profileId.toString());

    const { data } = await client.get<Location[]>(endpoint, {
        transformResponse: transformResponse(parseLocation),
    });

    return data;
}

/**
 * Fetches the authorities associated with a specific profile.
 *
 * @param profileId - The ID of the profile whose authorities are to be fetched.
 * @returns A promise that resolves to an array of authorities.
 */
export async function readProfileAuthorities(profileId: string): Promise<Authority[]> {
    const endpoint = endpoints.profiles.authorities.list.replace('{id}', profileId.toString());

    const { data } = await client.get<Authority[]>(endpoint, {
        transformResponse: transformResponse(parseAuthority),
    });

    return data;
}
