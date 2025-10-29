import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { transformPaginatedResponse } from '@/utils/service';
import type { Authority, AuthorityFilter, AuthorityRequest } from './types';
import type { Profile } from '../profile';
import type { Paginated } from '@/utils/pagination';

/**
 * Parse an authority object from the API by converting string dates to Date objects
 *
 * @param authorityData - The raw authority data from the API
 * @returns The parsed authority object
 */
export function parseAuthority(authorityData: any | null): Authority {
    return {
        ...authorityData,
        createdAt: new Date(authorityData.createdAt),
        updatedAt: new Date(authorityData.updatedAt),
    };
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
    const params = {
        ...filters,
    };

    const { data } = await client.get<Paginated<Authority>>(endpoints.authorities.list, {
        params,
        transformResponse: transformPaginatedResponse(parseAuthority),
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
    const { data } = await client.get<Authority>(endpoint);
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
    const { data } = await client.post<Authority>(endpoint, request);
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
    const { data } = await client.patch<Authority>(endpoint, request);
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
    const { data } = await client.get<Profile[]>(endpoint);
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
