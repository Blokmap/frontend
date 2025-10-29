import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { transformPaginatedResponseFactory, transformResponseFactory } from '@/utils/service';
import { parseProfileResponse } from '../auth';
import { parseLocationResponse } from '../location';
import type { Profile } from '../profile';
import type { Authority, AuthorityFilter, AuthorityRequest } from './types';
import type { Paginated } from '@/utils/pagination';

/**
 * Parses an Authority response object.
 *
 * @param data - The raw authority data from the API.
 * @returns The parsed Authority object.
 */
export function parseAuthorityResponse(data: any): Authority {
    const result: Authority = {
        ...data,
    };

    if (data.createdBy) {
        result.createdBy = parseProfileResponse(data.createdBy);
    }

    if (data.updatedBy) {
        result.updatedBy = parseProfileResponse(data.updatedBy);
    }

    if (data.members) {
        result.members = data.members.map(parseProfileResponse);
    }

    if (data.locations) {
        result.locations = data.locations.map(parseLocationResponse);
    }

    return result;
}

/**
 * Read authorities with optional filters (returns paginated list).
 *
 * @param filters - The filters to apply when reading authorities.
 * @returns A promise that resolves to a list of authorities.
 */
export async function readAuthorities(
    filters: Partial<AuthorityFilter> = {},
): Promise<Paginated<Authority>> {
    const endpoint = endpoints.authorities.list;

    const transformResponse = transformPaginatedResponseFactory(parseAuthorityResponse);

    const { data } = await client.get<Paginated<Authority>>(endpoint, {
        params: filters,
        transformResponse,
    });

    return data;
}

/**
 * Read a single authority by ID.
 *
 * @param id - The ID of the authority to read.
 * @returns A promise that resolves to the authority.
 */
export async function readAuthority(id: number): Promise<Authority> {
    const endpoint = endpoints.authorities.read.replace('{id}', id.toString());

    const transformResponse = transformResponseFactory(parseAuthorityResponse);

    const { data } = await client.get<Authority>(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Create a new authority.
 *
 * @param request - The authority creation request data.
 * @returns A promise that resolves to the created authority.
 */
export async function createAuthority(request: AuthorityRequest): Promise<Authority> {
    const endpoint = endpoints.authorities.create.toString();

    const transformResponse = transformResponseFactory(parseAuthorityResponse);

    const { data } = await client.post<Authority>(endpoint, request, {
        transformResponse,
    });

    return data;
}

/**
 * Update an existing authority.
 *
 * @param id - The ID of the authority to update.
 * @param request - The authority update request data.
 * @returns A promise that resolves to the updated authority.
 */
export async function updateAuthority(
    id: number,
    request: Partial<AuthorityRequest>,
): Promise<Authority> {
    const endpoint = endpoints.authorities.update.replace('{id}', id.toString());

    const transformResponse = transformResponseFactory(parseAuthorityResponse);

    const { data } = await client.patch<Authority>(endpoint, request, {
        transformResponse,
    });

    return data;
}

/**
 * Read members (profiles) of an authority.
 *
 * @param id - The ID of the authority.
 * @returns A promise that resolves to an array of profiles.
 */
export async function readAuthorityMembers(id: number): Promise<Profile[]> {
    const endpoint = endpoints.authorities.members.list.replace('{id}', id.toString());

    const transformResponse = transformResponseFactory(parseProfileResponse);

    const { data } = await client.get<Profile[]>(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Add a member to an authority.
 *
 * @param id - The ID of the authority.
 * @param profileId - The ID of the profile to add.
 * @returns A promise that resolves when the member is added.
 */
export async function addAuthorityMember(id: number, profileId: string): Promise<void> {
    const endpoint = endpoints.authorities.members.add.replace('{id}', id.toString());

    await client.post(endpoint, { profileId });
}

/**
 * Remove a member from an authority.
 *
 * @param id - The ID of the authority.
 * @param profileId - The ID of the profile to remove.
 * @returns A promise that resolves when the member is removed.
 */
export async function removeAuthorityMember(id: number, profileId: string): Promise<void> {
    const endpoint = endpoints.authorities.members.remove
        .replace('{id}', id.toString())
        .replace('{profileId}', String(profileId));

    await client.delete(endpoint);
}
