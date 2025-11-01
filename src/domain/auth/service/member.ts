import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { parseProfileResponse } from '@/domain/profile';
import { stringToDate } from '@/utils/date';
import { transformPaginatedResponseFactory, transformResponseFactory } from '@/utils/service';
import { parseRoleResponse } from './role';
import type { Membership, MembershipBody } from '../types';
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
 * Deletes a member from a specific location.
 *
 * @param locationId - The ID of the location.
 * @param memberId - The ID of the member to be deleted.
 * @returns A promise that resolves when the member is deleted.
 */
export async function deleteLocationMember(locationId: number, memberId: number): Promise<void> {
    const endpoint = endpoints.locations.members.delete
        .replace('{id}', locationId.toString())
        .replace('{profileId}', memberId.toString());

    await client.delete(endpoint);
}

/**
 * Updates a member's role in a specific location.
 *
 * @param locationId - The ID of the location.
 * @param memberId - The ID of the member to be updated.
 * @param body - The membership body containing the new role ID.
 *
 * @returns A promise that resolves when the member is updated.
 */
export async function updateLocationMember(
    locationId: number,
    memberId: number,
    body: MembershipBody,
): Promise<void> {
    const endpoint = endpoints.locations.members.update
        .replace('{id}', locationId.toString())
        .replace('{profileId}', memberId.toString());

    const transformResponse = transformResponseFactory(parseMembershipResponse);

    const { data } = await client.patch(endpoint, body, {
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
