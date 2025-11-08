import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { parseAuthorityResponse } from '@/domain/authority';
import { parseReservationResponse, type Reservation } from '@/domain/reservation';
import { stringToDate } from '@/utils/date';
import {
    formatFormDataBody,
    formatRequest,
    transformPaginatedResponseFactory,
    transformResponseFactory,
} from '@/utils/serviceUtils';
import { parseImageResponse } from '../image';
import { parseInstitutionResponse } from '../institution';
import type {
    Profile,
    ProfileStats,
    ProfileFilter,
    ProfileScanBody,
    FoundProfile,
    ProfileFindFilter,
} from './types';
import type { Paginated, Pagination } from '@/utils/pagination';

/**
 * Parses a profile response object.
 *
 * @param data - The raw profile data from the API.
 * @returns The parsed Profile object.
 */
export function parseProfileResponse(data: any): Profile {
    if (!data) return data;

    const result: Profile = {
        ...data,
        avatarUrl: parseImageResponse(data.avatarUrl),
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
    };

    if (data.institution) {
        result.institution = parseInstitutionResponse(data.institution);
    }

    if (data.authorities) {
        result.authorities = data.authorities.map(parseAuthorityResponse);
    }

    return result;
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
 * Updates the profile avatar for a given profile ID.
 *
 * @param profileId - The ID of the profile to update the avatar for.
 * @param file - The file to upload as the new avatar.
 * @returns A promise that resolves when the avatar is updated.
 */
export async function updateProfileAvatar(profileId: string, file: File): Promise<void> {
    const endpoint = endpoints.profiles.avatar.replace('{id}', String(profileId));
    const data = formatFormDataBody({ image: file });

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
 * Parses a found profile response object (simplified profile for search results).
 *
 * @param data - The raw found profile data from the API.
 * @returns The parsed FoundProfile object.
 */
export function parseFoundProfileResponse(data: any): FoundProfile {
    if (!data) return data;

    return {
        ...data,
        avatarUrl: parseImageResponse(data.avatarUrl),
    };
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
 * Block a profile to prevent it from accessing the application.
 *
 * @param profileId - The ID of the profile to block.
 * @returns A promise that resolves to the blocked profile.
 */
export async function blockProfile(profileId: string): Promise<Profile> {
    const endpoint = endpoints.profiles.block.replace('{id}', profileId.toString());

    const transformResponse = transformResponseFactory(parseProfileResponse);

    const { data } = await client.post(endpoint, null, {
        transformResponse,
    });

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

    const transformResponse = transformResponseFactory(parseProfileResponse);

    const { data } = await client.post(endpoint, null, {
        transformResponse,
    });

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
    request: ProfileScanBody,
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
