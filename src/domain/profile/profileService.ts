import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { parseReservationResponse, type Reservation } from '@/domain/reservation';
import {
    formatFormDataBody,
    formatRequest,
    transformPaginatedResponseFactory,
    transformResponseFactory,
} from '@/utils/serviceUtils';
import { parseFoundProfileResponse, parseProfileResponse } from './profileParser';
import type {
    FoundProfile,
    Profile,
    ProfileFilter,
    ProfileFindFilter,
    ProfileScanRequest,
    ProfileStats,
} from './types';
import type { Paginated, Pagination } from '@/utils/pagination';

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
 * Updates the profile avatar for a given profile ID.
 *
 * @param profileId - The ID of the profile to update the avatar for.
 * @param file - The file to upload as the new avatar.
 * @returns A promise that resolves when the avatar is updated.
 */
export async function updateProfileAvatar(profileId: string, file: File): Promise<void> {
    const endpoint = endpoints.profiles.avatar.replace('{id}', String(profileId));
    const data = formatFormDataBody({ image: file });

    await client.put(endpoint, data, {
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

    const transformResponse = transformResponseFactory(parseProfileResponse);

    const { data } = await client.patch<any>(endpoint, profileData, {
        transformResponse,
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

    const transformResponse = transformResponseFactory(parseProfileResponse);

    const { data } = await client.get<Profile>(endpoint, {
        transformResponse,
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
    const endpoint = endpoints.profiles.list;

    const transformResponse = transformPaginatedResponseFactory(parseProfileResponse);

    const { data } = await client.get<Paginated<Profile>>(endpoint, {
        params: filters,
        transformResponse,
    });

    return data;
}

/**
 * Find profiles by query string (normal user endpoint, returns paginated list).
 *
 * @param filters - The filters to apply when finding profiles (must include query).
 * @returns A promise that resolves to a paginated list of found profiles.
 */
export async function findProfiles(filters: ProfileFindFilter): Promise<Paginated<FoundProfile>> {
    const endpoint = endpoints.profiles.find;

    const transformResponse = transformPaginatedResponseFactory(parseFoundProfileResponse);

    const { data } = await client.get<Paginated<FoundProfile>>(endpoint, {
        params: filters,
        transformResponse,
    });

    return data;
}

/**
 * Read profiles associated with a specific institution (returns paginated list).
 *
 * @param institutionId - The ID of the institution.
 * @param filters - The filters to apply when reading profiles.
 * @returns A promise that resolves to a paginated list of profiles.
 */
export async function readInstitutionProfiles(
    institutionId: number,
    pagination: Pagination,
    filters: Partial<ProfileFilter> = {},
): Promise<Paginated<Profile>> {
    const endpoint = endpoints.institutions.profiles.list.replace('{id}', institutionId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseProfileResponse);

    const { data } = await client.get<Paginated<Profile>>(endpoint, {
        params: { ...filters, ...pagination },
        transformResponse,
    });

    return data;
}

/**
 * Add a profile to a specific institution.
 * That profile is then said to have an association with the institution.
 *
 * @param institutionId - The ID of the institution.
 * @param profileId - The ID of the profile to add.
 *
 * @returns A promise that resolves to the added profile.
 */
export async function addInstitutionProfile(
    institutionId: number,
    username: string,
): Promise<Profile> {
    const endpoint = endpoints.institutions.profiles.add.replace('{id}', institutionId.toString());

    const body = { username };

    const transformResponse = transformResponseFactory(parseProfileResponse);

    const { data } = await client.post<Profile>(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Block a profile to prevent it from accessing the application.
 *
 * @param profileId - The ID of the profile to block.
 * @returns A promise that resolves to the blocked profile.
 */
export async function blockProfile(profileId: string): Promise<void> {
    const endpoint = endpoints.profiles.block.replace('{id}', profileId.toString());
    await client.post(endpoint);
}

/**
 * Unblock a profile to restore its access to the application.
 *
 * @param profileId - The ID of the profile to unblock.
 * @returns A promise that resolves to the unblocked profile.
 */
export async function unblockProfile(profileId: string): Promise<void> {
    const endpoint = endpoints.profiles.unblock.replace('{id}', profileId.toString());

    await client.post(endpoint);
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
    const endpoint = endpoints.profiles.scan.replace('{id}', profileId.toString());

    const body = {
        ...formatRequest(request, ['day']),
    };

    const transformResponse = transformResponseFactory(parseReservationResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}
