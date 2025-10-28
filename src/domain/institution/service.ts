import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import type { Institution, InstitutionFilter, InstitutionRequest } from './types';
import type { Profile } from '../profile';
import type { Paginated } from '@/utils/pagination';

/**
 * List institutions with optional filters.
 *
 * @param filters - The filters to apply when listing institutions.
 * @returns A promise that resolves to a list of institutions.
 */
export async function listInstitutions(
    filters: Partial<InstitutionFilter> = {},
): Promise<Paginated<Institution>> {
    const params = {
        ...filters,
    };

    const response = await client.get<Paginated<Institution>>(endpoints.institutions.list, {
        params,
    });

    return response.data;
}

/**
 * Read a single institution by slug.
 *
 * @param slug - The slug of the institution to read.
 * @returns A promise that resolves to the institution.
 */
export async function readInstitution(slug: string): Promise<Institution> {
    const endpoint = endpoints.institutions.read.replace('{id}', slug);
    const { data } = await client.get<Institution>(endpoint);
    return data;
}

/**
 * Create a new institution.
 *
 * @param request - The institution creation request data.
 * @returns A promise that resolves to the created institution.
 */
export async function createInstitution(request: InstitutionRequest): Promise<Institution> {
    const endpoint = endpoints.institutions.create.toString();
    const { data } = await client.post<Institution>(endpoint, request);
    return data;
}

/**
 * Update an existing institution.
 *
 * @param id - The ID of the institution to update.
 * @param request - The institution update request data.
 * @returns A promise that resolves to the updated institution.
 */
export async function updateInstitution(
    id: number,
    request: Partial<InstitutionRequest>,
): Promise<Institution> {
    const endpoint = endpoints.institutions.update.replace('{id}', id.toString());
    const { data } = await client.patch<Institution>(endpoint, request);
    return data;
}

/**
 * List members (profiles) of an institution.
 *
 * @param slug - The slug of the institution.
 * @returns A promise that resolves to an array of profiles.
 */
export async function listInstitutionMembers(slug: string): Promise<Profile[]> {
    const endpoint = endpoints.institutions.members.list.replace('{id}', slug);
    const { data } = await client.get<Profile[]>(endpoint);
    return data;
}

/**
 * Add a member to an institution.
 *
 * @param slug - The slug of the institution.
 * @param profileId - The ID of the profile to add.
 * @returns A promise that resolves when the member is added.
 */
export async function addInstitutionMember(slug: string, profileId: string): Promise<void> {
    const endpoint = endpoints.institutions.members.add.replace('{id}', slug);
    await client.post(endpoint, { profileId });
}

/**
 * Remove a member from an institution.
 *
 * @param slug - The slug of the institution.
 * @param profileId - The ID of the profile to remove.
 * @returns A promise that resolves when the member is removed.
 */
export async function removeInstitutionMember(slug: string, profileId: string): Promise<void> {
    const endpoint = endpoints.institutions.members.remove
        .replace('{id}', slug)
        .replace('{profileId}', String(profileId));
    await client.delete(endpoint);
}

/**
 * List authorities associated with an institution.
 *
 * @param slug - The slug of the institution.
 * @returns A promise that resolves to an array of authorities.
 */
export async function listInstitutionAuthorities(slug: string): Promise<any[]> {
    const endpoint = endpoints.institutions.authorities.list.replace('{id}', slug);
    const { data } = await client.get<any[]>(endpoint);
    return data;
}

/**
 * Add an authority to an institution.
 *
 * @param slug - The slug of the institution.
 * @param authorityId - The ID of the authority to add.
 * @returns A promise that resolves when the authority is added.
 */
export async function addInstitutionAuthority(slug: string, authorityId: number): Promise<void> {
    const endpoint = endpoints.institutions.authorities.add.replace('{id}', slug);
    await client.post(endpoint, { authorityId });
}

/**
 * Remove an authority from an institution.
 *
 * @param slug - The slug of the institution.
 * @param authorityId - The ID of the authority to remove.
 * @returns A promise that resolves when the authority is removed.
 */
export async function removeInstitutionAuthority(slug: string, authorityId: number): Promise<void> {
    const endpoint = endpoints.institutions.authorities.remove
        .replace('{id}', slug)
        .replace('{authorityId}', String(authorityId));
    await client.delete(endpoint);
}
