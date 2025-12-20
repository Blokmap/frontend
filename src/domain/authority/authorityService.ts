import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import {
    formatFormDataBody,
    transformPaginatedResponseFactory,
    transformResponseFactory,
} from '@/utils/serviceUtils';
import { parseAuthorityResponse } from './authorityParser';
import type { Authority, AuthorityBody, AuthorityFilter } from './types';
import type { Paginated } from '@/utils/pagination';

export type AuthorityIncludes = 'institution' | 'createdBy' | 'updatedBy';

export type ReadAuthoritiesParams = {
    authorityFilter?: Partial<AuthorityFilter>;
    authorityIncludes?: AuthorityIncludes[];
};

export async function readAuthorities({
    authorityFilter = {},
    authorityIncludes = [],
}: ReadAuthoritiesParams): Promise<Paginated<Authority>> {
    const endpoint = endpoints.authorities.list;

    const transformResponse = transformPaginatedResponseFactory(parseAuthorityResponse);

    const params = { ...authorityFilter, authorityIncludes };

    const { data } = await client.get<Paginated<Authority>>(endpoint, {
        params,
        transformResponse,
    });

    return data;
}

/**
 * Read authorities for a specific institution with optional filters (returns paginated list).
 *
 * @param institutionId - The ID of the institution.
 * @param filters - The filters to apply when reading authorities.
 * @returns A promise that resolves to a list of authorities.
 */
export async function readInstitutionAuthorities(
    institutionId: number,
    filters: Partial<AuthorityFilter> = {},
): Promise<Paginated<Authority>> {
    const endpoint = endpoints.institutions.authorities.list.replace(
        '{id}',
        institutionId.toString(),
    );

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
export async function readAuthority(
    id: number,
    includes: AuthorityIncludes[] = [],
): Promise<Authority> {
    const endpoint = endpoints.authorities.read.replace('{id}', id.toString());

    const transformResponse = transformResponseFactory(parseAuthorityResponse);

    const { data } = await client.get<Authority>(endpoint, {
        transformResponse,
        params: { authorityIncludes: includes },
    });

    return data;
}

/**
 * Create a new authority.
 *
 * @param request - The authority creation request data.
 * @returns A promise that resolves to the created authority.
 */
export async function createAuthority(request: AuthorityBody): Promise<Authority> {
    const endpoint = endpoints.authorities.create.toString();

    const transformResponse = transformResponseFactory(parseAuthorityResponse);

    const { data } = await client.post<Authority>(endpoint, request, {
        transformResponse,
    });

    return data;
}

/**
 * Updates the authority logo for a given authority ID.
 *
 * @param authorityId - The ID of the authority to update the logo for.
 * @param file - The file to upload as the new logo.
 * @returns A promise that resolves when the logo is updated.
 */
export async function updateAuthorityLogo(authorityId: number, file: File): Promise<void> {
    const endpoint = endpoints.authorities.logo.replace('{id}', String(authorityId));
    const data = formatFormDataBody({ image: file });

    await client.put(endpoint, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

/**
 * Deletes the authority logo for a given authority ID.
 *
 * @param authorityId - The ID of the authority to delete the logo for.
 * @returns A promise that resolves when the logo is deleted.
 */
export async function deleteAuthorityLogo(authorityId: number): Promise<void> {
    const endpoint = endpoints.authorities.logo.replace('{id}', String(authorityId));

    await client.delete(endpoint);
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
    request: Partial<AuthorityBody>,
): Promise<Authority> {
    const endpoint = endpoints.authorities.update.replace('{id}', id.toString());

    const transformResponse = transformResponseFactory(parseAuthorityResponse);

    const { data } = await client.patch<Authority>(endpoint, request, {
        transformResponse,
    });

    return data;
}

/**
 * Delete an authority by ID.
 *
 * @param id - The ID of the authority to delete.
 * @returns A promise that resolves when the authority is deleted.
 */
export async function deleteAuthority(id: number): Promise<void> {
    const endpoint = endpoints.authorities.delete.replace('{id}', id.toString());

    await client.delete<void>(endpoint);
}

/**
 * Fetches the authorities associated with a specific profile.
 *
 * @param profileId - The ID of the profile whose authorities are to be fetched.
 * @returns A promise that resolves to an array of authorities.
 */
export async function readProfileAuthorities(profileId: string): Promise<Authority[]> {
    const endpoint = endpoints.profiles.authorities.list.replace('{id}', profileId.toString());

    const transformResponse = transformResponseFactory(parseAuthorityResponse);

    const { data } = await client.get<Authority[]>(endpoint, {
        transformResponse,
    });

    return data;
}
