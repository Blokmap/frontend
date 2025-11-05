import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { parseProfileResponse } from '@/domain/profile';
import { stringToDate } from '@/utils/date';
import { transformPaginatedResponseFactory, transformResponseFactory } from '@/utils/service';
import { parseRoleResponse } from './service/role';
import type { Membership, MembershipBody } from './types';
import type { Paginated } from '@/utils/pagination';

export * from './service/role';
export * from './service/permission';

/**
 * Parses a Membership response object.
 */
export function parseMembershipResponse(data: any): Membership {
    if (!data) return data;

    return {
        ...data,
        assignedAt: stringToDate(data.assignedAt),
        role: parseRoleResponse(data.role),
        profile: parseProfileResponse(data.profile),
    };
}

/**
 * Fetches the members for a specific location.
 */
export async function readLocationMembers(locationId: number): Promise<Paginated<Membership>> {
    const endpoint = endpoints.locations.members.list.replace('{id}', locationId.toString());
    const transformResponse = transformPaginatedResponseFactory(parseMembershipResponse);
    const { data } = await client.get(endpoint, { transformResponse });
    return data;
}

/**
 * Deletes a member from a specific location.
 */
export async function deleteLocationMember(locationId: number, memberId: number): Promise<void> {
    const endpoint = endpoints.locations.members.delete
        .replace('{id}', locationId.toString())
        .replace('{profileId}', memberId.toString());
    await client.delete(endpoint);
}

/**
 * Updates a member's role in a specific location.
 */
export async function updateLocationMember(
    locationId: number,
    memberId: string,
    body: MembershipBody,
): Promise<void> {
    const endpoint = endpoints.locations.members.update
        .replace('{id}', locationId.toString())
        .replace('{profileId}', memberId.toString());

    const transformResponse = transformResponseFactory(parseMembershipResponse);

    const { data } = await client.patch(
        endpoint,
        { locationRoleId: body.roleId },
        { transformResponse },
    );

    return data;
}

/**
 * Fetches the members for a specific authority.
 */
export async function readAuthorityMembers(authorityId: number): Promise<Paginated<Membership>> {
    const endpoint = endpoints.authorities.members.list.replace('{id}', authorityId.toString());
    const transformResponse = transformPaginatedResponseFactory(parseMembershipResponse);
    const { data } = await client.get(endpoint, { transformResponse });
    return data;
}

/**
 * Fetches the members for a specific institution.
 */
export async function readInstitutionMembers(
    institutionId: number,
): Promise<Paginated<Membership>> {
    const endpoint = endpoints.institutions.members.list.replace('{id}', institutionId.toString());
    const transformResponse = transformPaginatedResponseFactory(parseMembershipResponse);
    const { data } = await client.get(endpoint, { transformResponse });
    return data;
}

/**
 * Adds a member to a specific authority.
 */
export async function addAuthorityMember(authorityId: number, profileId: string): Promise<void> {
    const endpoint = endpoints.authorities.members.add.replace('{id}', authorityId.toString());
    await client.post(endpoint, { profileId });
}

/**
 * Removes a member from a specific authority.
 */
export async function removeAuthorityMember(authorityId: number, profileId: string): Promise<void> {
    const endpoint = endpoints.authorities.members.remove
        .replace('{id}', authorityId.toString())
        .replace('{profileId}', String(profileId));
    await client.delete(endpoint);
}

/**
 * Adds a member to a specific institution.
 */
export async function addInstitutionMember(
    institutionId: number,
    profileId: string,
): Promise<void> {
    const endpoint = endpoints.institutions.members.add.replace('{id}', institutionId.toString());
    await client.post(endpoint, { profileId });
}

/**
 * Removes a member from a specific institution.
 */
export async function removeInstitutionMember(
    institutionId: number,
    profileId: string,
): Promise<void> {
    const endpoint = endpoints.institutions.members.remove
        .replace('{id}', institutionId.toString())
        .replace('{profileId}', String(profileId));
    await client.delete(endpoint);
}
