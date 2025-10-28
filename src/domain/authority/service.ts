import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { Authority, AuthorityFilter, AuthorityRequest } from './types';
import type { Profile } from '../profile';
import type { Paginated } from '@/utils/pagination';

/**
 * List authorities with optional filters.
 *
 * @param filters - The filters to apply when listing authorities.
 * @returns A promise that resolves to a list of authorities.
 */
export async function listAuthorities(
    filters: Partial<AuthorityFilter> = {},
): Promise<Paginated<Authority>> {
    const params = {
        ...filters,
    };

    const response = await client.get<Paginated<Authority>>(endpoints.authorities.list, {
        params,
    });

    return response.data;
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
 * List members (profiles) of an authority.
 *
 * @param id - The ID of the authority.
 * @returns A promise that resolves to an array of profiles.
 */
export async function listAuthorityMembers(id: number): Promise<Profile[]> {
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
