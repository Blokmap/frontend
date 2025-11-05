import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { stringToDate } from '@/utils/date';
import { transformResponseFactory } from '@/utils/service';
import type { Role } from '../types';

/**
 * Parses a Role response object.
 *
 * @param data - The raw role data from the API.
 * @returns The parsed Role object.
 */
export function parseRoleResponse(data: any): Role {
    if (!data) return data;

    const result: Role = {
        ...data,
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
    };

    return result;
}

/**
 * Fetches the roles for a specific location.
 *
 * @param locationId - The ID of the location.
 * @returns A promise that resolves to an array of roles for the specified location.
 */
export async function readLocationRoles(locationId: number): Promise<Role[]> {
    const endpoint = endpoints.locations.roles.replace('{id}', locationId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Fetches the roles for a specific institution.
 *
 * @param institutionId - The ID of the institution.
 * @returns A promise that resolves to an array of roles for the specified institution.
 */
export async function readAuthorityRoles(authorityId: number): Promise<Role[]> {
    const endpoint = endpoints.authorities.roles.replace('{id}', authorityId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Fetches the roles for a specific institution.
 *
 * @param institutionId - The ID of the institution.
 * @returns A promise that resolves to an array of roles for the specified institution.
 */
export async function readInstitutionRoles(institutionId: number): Promise<Role[]> {
    const endpoint = endpoints.institutions.roles.replace('{id}', institutionId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    return data;
}
