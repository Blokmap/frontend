import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { transformPaginatedResponseFactory, transformResponseFactory } from '@/utils/service';
import { parseProfileResponse } from '../auth';
import { parseAuthorityResponse } from '../authority';
import { parseImageResponse } from '../image';
import { parseTranslationResponse } from '../translation';
import type { Authority } from '../authority';
import type { Profile } from '../profile';
import type { Institution, InstitutionFilter, InstitutionRequest } from './types';
import type { Paginated } from '@/utils/pagination';

/**
 * Parses an Institution response object.
 *
 * @param data - The raw institution data from the API.
 * @returns The parsed Institution object.
 */
export function parseInstitutionResponse(data: any): Institution {
    const result: Institution = {
        ...data,
        name: parseTranslationResponse(data.name),
        logo: parseImageResponse(data.logo),
    };

    return result;
}

/**
 * Read institutions with optional filters (returns paginated list).
 *
 * @param filters - The filters to apply when reading institutions.
 * @returns A promise that resolves to a list of institutions.
 */
export async function readInstitutions(
    filters: Partial<InstitutionFilter> = {},
): Promise<Paginated<Institution>> {
    const endpoint = endpoints.institutions.list;

    const transformResponse = transformPaginatedResponseFactory(parseInstitutionResponse);

    const { data } = await client.get<Paginated<Institution>>(endpoint, {
        params: filters,
        transformResponse,
    });

    return data;
}

/**
 * Read a single institution by slug.
 *
 * @param slug - The slug of the institution to read.
 * @returns A promise that resolves to the institution.
 */
export async function readInstitution(slug: string): Promise<Institution> {
    const endpoint = endpoints.institutions.read.replace('{id}', slug);

    const transformResponse = transformResponseFactory(parseInstitutionResponse);

    const { data } = await client.get<Institution>(endpoint, {
        transformResponse,
    });

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

    const transformResponse = transformResponseFactory(parseInstitutionResponse);

    const { data } = await client.post<Institution>(endpoint, request, {
        transformResponse,
    });

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

    const transformResponse = transformResponseFactory(parseInstitutionResponse);

    const { data } = await client.patch<Institution>(endpoint, request, {
        transformResponse,
    });

    return data;
}

/**
 * Read members (profiles) of an institution.
 *
 * @param slug - The slug of the institution.
 * @returns A promise that resolves to an array of profiles.
 */
export async function readInstitutionMembers(id: number): Promise<Paginated<Profile>> {
    const endpoint = endpoints.institutions.members.list.replace('{id}', id.toString());

    const transformResponse = transformPaginatedResponseFactory(parseProfileResponse);

    const { data } = await client.get<Paginated<Profile>>(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Add a member to an institution.
 *
 * @param slug - The slug of the institution.
 * @param profileId - The ID of the profile to add.
 * @returns A promise that resolves when the member is added.
 */
export async function addInstitutionMember(id: number, profileId: string): Promise<void> {
    const endpoint = endpoints.institutions.members.add.replace('{id}', id.toString());
    await client.post(endpoint, { profileId });
}

/**
 * Remove a member from an institution.
 *
 * @param id - The ID of the institution.
 * @param profileId - The ID of the profile to remove.
 * @returns A promise that resolves when the member is removed.
 */
export async function removeInstitutionMember(id: number, profileId: string): Promise<void> {
    const endpoint = endpoints.institutions.members.remove
        .replace('{id}', id.toString())
        .replace('{profileId}', String(profileId));

    await client.delete(endpoint);
}

/**
 * Read authorities associated with an institution.
 *
 * @param slug - The slug of the institution.
 * @returns A promise that resolves to an array of authorities.
 */
export async function readInstitutionAuthorities(id: number): Promise<Paginated<Authority>> {
    const endpoint = endpoints.institutions.authorities.list.replace('{id}', id.toString());

    const transformResponse = transformPaginatedResponseFactory(parseAuthorityResponse);

    const { data } = await client.get<Paginated<Authority>>(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Add an authority to an institution.
 *
 * @param slug - The slug of the institution.
 * @param authorityId - The ID of the authority to add.
 * @returns A promise that resolves when the authority is added.
 */
export async function addInstitutionAuthority(id: number, authorityId: number): Promise<void> {
    const endpoint = endpoints.institutions.authorities.add.replace('{id}', id.toString());

    await client.post(endpoint, { authorityId });
}

/**
 * Remove an authority from an institution.
 *
 * @param slug - The slug of the institution.
 * @param authorityId - The ID of the authority to remove.
 * @returns A promise that resolves when the authority is removed.
 */
export async function removeInstitutionAuthority(id: number, authorityId: number): Promise<void> {
    const endpoint = endpoints.institutions.authorities.remove
        .replace('{id}', id.toString())
        .replace('{authorityId}', String(authorityId));

    await client.delete(endpoint);
}
