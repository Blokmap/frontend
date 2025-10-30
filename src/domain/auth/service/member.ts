import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { parseProfileResponse } from '@/domain/profile';
import { stringToDate } from '@/utils/date';
import { transformPaginatedResponseFactory } from '@/utils/service';
import { parseRoleResponse } from './role';
import type { Membership } from '../types';
import type { Paginated } from '@/utils/pagination';

/**
 * Parses a Membership response object.
 *
 * @param data - The raw membership data from the API.
 * @returns The parsed Membership object.
 */
export function parseMembershipResponse(data: any): Membership {
    if (!data) return data;

    const result: Membership = {
        ...data,
        assignedAt: stringToDate(data.assignedAt),
        role: parseRoleResponse(data.role),
        profile: parseProfileResponse(data.profile),
    };

    return result;
}

/**
 * Fetches the members for a specific location.
 *
 * @param locationId - The ID of the location.
 * @returns A promise that resolves to an array of memberships for the specified location.
 */
export async function readLocationMembers(locationId: number): Promise<Paginated<Membership>> {
    const endpoint = endpoints.locations.members.list.replace('{id}', locationId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseMembershipResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Fetches the members for a specific authority.
 *
 * @param authorityId - The ID of the authority.
 * @returns A promise that resolves to an array of memberships for the specified authority.
 */
export async function readAuthorityMembers(authorityId: number): Promise<Paginated<Membership>> {
    const endpoint = endpoints.authorities.members.list.replace('{id}', authorityId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseMembershipResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Fetches the members for a specific institution.
 *
 * @param institutionId - The ID of the institution.
 * @returns A promise that resolves to an array of memberships for the specified institution.
 */
export async function readInstitutionMembers(
    institutionId: number,
): Promise<Paginated<Membership>> {
    const endpoint = endpoints.institutions.members.list.replace('{id}', institutionId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseMembershipResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    return data;
}
