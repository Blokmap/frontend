import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import {
    formatFormDataBody,
    transformPaginatedResponseFactory,
    transformResponseFactory,
} from '@/utils/serviceUtils';
import { parseAuthorityResponse } from '../authority';
import { parseInstitutionResponse } from './institutionParser';
import type { Authority } from '../authority';
import type { Institution, InstitutionRequest, InstitutionFilter } from './types';
import type { Paginated } from '@/utils/pagination';

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
 * Read a single institution by ID.
 *
 * @param id - The ID of the institution to read.
 * @returns A promise that resolves to the institution.
 */
export async function readInstitution(id: number): Promise<Institution> {
    const endpoint = endpoints.institutions.read.replace('{id}', id.toString());

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
 * Updates the institution logo for a given institution ID.
 *
 * @param institutionId - The ID of the institution to update the logo for.
 * @param file - The file to upload as the new logo.
 * @returns A promise that resolves when the logo is updated.
 */
export async function updateInstitutionLogo(institutionId: number, file: File): Promise<void> {
    const endpoint = endpoints.institutions.logo.replace('{id}', String(institutionId));
    const data = formatFormDataBody({ image: file });

    await client.put(endpoint, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

/**
 * Deletes the institution logo for a given institution ID.
 *
 * @param institutionId - The ID of the institution to delete the logo for.
 * @returns A promise that resolves when the logo is deleted.
 */
export async function deleteInstitutionLogo(institutionId: number): Promise<void> {
    const endpoint = endpoints.institutions.logo.replace('{id}', String(institutionId));

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
