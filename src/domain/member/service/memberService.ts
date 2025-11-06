import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { parseProfileResponse } from '@/domain/profile';
import { transformPaginatedResponseFactory, transformResponseFactory } from '@/utils/serviceUtils';
import { parseAuthorityResponse } from '../../authority';
import { parseInstitutionResponse } from '../../institution';
import { parseLocationResponse } from '../../location';
import { parseRoleResponse } from './memberRoleService';
import type {
    AuthorityMembership,
    InstitutionMembership,
    LocationMembership,
    Member,
    MemberBody,
} from '../types';
import type { Paginated } from '@/utils/pagination';

export * from './memberRoleService';
export * from './memberPermissionService';

/**
 * A membership represents the association of a profile with a context
 *
 * @param data - The raw response data
 * @returns - The parsed Membership object
 */
export function parseLocationMembershipResponse(data: any): LocationMembership {
    return {
        location: parseLocationResponse(data.location),
        role: parseRoleResponse(data.role),
    };
}

/**
 * Parses a membership response from the API.
 *
 * @param data - The raw response data
 * @returns - The parsed Membership object
 */
export function parseAuthorityMembershipResponse(data: any): AuthorityMembership {
    return {
        authority: parseAuthorityResponse(data.authority),
        role: parseRoleResponse(data.role),
    };
}

/**
 * Parses a membership response from the API.
 *
 * @param data - The raw response data
 * @returns - The parsed Membership object
 */
export function parseInstitutionMembershipResponse(data: any): InstitutionMembership {
    return {
        institution: parseInstitutionResponse(data.institution),
        role: parseRoleResponse(data.role),
    };
}

/**
 * Parses a member response from the API.
 *
 * @param data - The raw response data
 * @returns - The parsed Member object
 */
export function parseMemberResponse(data: any): Member {
    return {
        profile: parseProfileResponse(data.profile),
        role: parseRoleResponse(data.role),
    };
}

/**
 * Fetches the members for a specific location.
 */
export async function readLocationMembers(
    locationId: number,
): Promise<Paginated<LocationMembership>> {
    const endpoint = endpoints.locations.members.list.replace('{id}', locationId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseLocationMembershipResponse);

    const { data } = await client.get(endpoint, { transformResponse });

    return data;
}

/**
 * Adds a member to a specific location.
 *
 * @param locationId - The ID of the location
 * @param profileId - The ID of the profile to add as a member
 */
export async function addLocationMember(locationId: number, profileId: string): Promise<void> {
    const endpoint = endpoints.locations.members.add.replace('{id}', locationId.toString());

    await client.post(endpoint, { profileId });
}

/**
 * Removes a member from a specific location.
 *
 * @param locationId - The ID of the location
 * @param profileId - The ID of the profile to remove as a member
 */
export async function removeLocationMember(locationId: number, profileId: string): Promise<void> {
    const endpoint = endpoints.locations.members.delete
        .replace('{id}', locationId.toString())
        .replace('{profileId}', String(profileId));

    await client.delete(endpoint);
}

/**
 * Updates a member's role in a specific location.
 *
 * @param locationId - The ID of the location
 * @param memberId - The ID of the member to update
 * @param body - The member body containing the new role ID
 */
export async function updateLocationMember(
    locationId: number,
    memberId: string,
    body: MemberBody,
): Promise<void> {
    const endpoint = endpoints.locations.members.update
        .replace('{id}', locationId.toString())
        .replace('{profileId}', memberId.toString());

    const transformResponse = transformResponseFactory(parseMemberResponse);

    const { data } = await client.patch(
        endpoint,
        { locationRoleId: body.roleId },
        { transformResponse },
    );

    return data;
}

/**
 * Fetches the members for a specific authority.
 *
 * @param authorityId - The ID of the authority
 */
export async function readAuthorityMembers(authorityId: number): Promise<Paginated<Member>> {
    const endpoint = endpoints.authorities.members.list.replace('{id}', authorityId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseMemberResponse);

    const { data } = await client.get(endpoint, { transformResponse });

    return data;
}

/**
 * Fetches the members for a specific institution.
 *
 * @param institutionId - The ID of the institution
 */
export async function readInstitutionMembers(institutionId: number): Promise<Paginated<Member>> {
    const endpoint = endpoints.institutions.members.list.replace('{id}', institutionId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseMemberResponse);

    const { data } = await client.get(endpoint, { transformResponse });

    return data;
}

/**
 * Adds a member to a specific authority.
 *
 * @param authorityId - The ID of the authority
 * @param profileId - The ID of the profile to add as a member
 */
export async function addAuthorityMember(authorityId: number, profileId: string): Promise<void> {
    const endpoint = endpoints.authorities.members.add.replace('{id}', authorityId.toString());

    await client.post(endpoint, { profileId });
}

/**
 * Updates a member's role in a specific authority.
 *
 * @param authorityId - The ID of the authority
 * @param memberId - The ID of the member to update
 * @param body - The member body containing the new role ID
 */
export async function updateAuthorityMember(
    authorityId: number,
    memberId: string,
    body: MemberBody,
): Promise<void> {
    const endpoint = endpoints.authorities.members.permissions.update
        .replace('{id}', authorityId.toString())
        .replace('{profileId}', memberId.toString());

    const transformResponse = transformResponseFactory(parseMemberResponse);

    const { data } = await client.patch(
        endpoint,
        { authorityRoleId: body.roleId },
        { transformResponse },
    );

    return data;
}

/**
 * Removes a member from a specific authority.
 *
 * @param authorityId - The ID of the authority
 * @param profileId - The ID of the profile to remove as a member
 */
export async function removeAuthorityMember(authorityId: number, profileId: string): Promise<void> {
    const endpoint = endpoints.authorities.members.remove
        .replace('{id}', authorityId.toString())
        .replace('{profileId}', String(profileId));

    await client.delete(endpoint);
}

/**
 * Adds a member to a specific institution.
 *
 * @param institutionId - The ID of the institution
 * @param profileId - The ID of the profile to add as a member
 */
export async function addInstitutionMember(
    institutionId: number,
    profileId: string,
): Promise<void> {
    const endpoint = endpoints.institutions.members.add.replace('{id}', institutionId.toString());

    await client.post(endpoint, { profileId });
}

/**
 * Updates a member's role in a specific institution.
 */
export async function updateInstitutionMember(
    institutionId: number,
    memberId: string,
    body: MemberBody,
): Promise<void> {
    const endpoint = endpoints.institutions.members.permissions.update
        .replace('{id}', institutionId.toString())
        .replace('{profileId}', memberId.toString());

    const transformResponse = transformResponseFactory(parseMemberResponse);

    const { data } = await client.patch(
        endpoint,
        { institutionRoleId: body.roleId },
        { transformResponse },
    );

    return data;
}

/**
 * Removes a member from a specific institution.
 *
 * @param institutionId - The ID of the institution
 * @param profileId - The ID of the profile to remove as a member
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

/**
 * Fetches a profile's authority memberships.
 *
 * @param profileId - The ID of the profile
 */
export async function readProfileLocationMemberships(
    profileId: string,
): Promise<LocationMembership[]> {
    const endpoint = endpoints.profiles.locations.memberships.replace('{id}', profileId);

    const transformResponse = transformResponseFactory(parseLocationMembershipResponse);

    const { data } = await client.get(endpoint, { transformResponse });

    return data;
}

/**
 * Fetches a profile's authority memberships.
 *
 * @param profileId - The ID of the profile
 */
export async function readProfileAuthorityMemberships(
    profileId: string,
): Promise<AuthorityMembership[]> {
    const endpoint = endpoints.profiles.authorities.memberships.replace('{id}', profileId);

    const transformResponse = transformResponseFactory(parseAuthorityMembershipResponse);

    const { data } = await client.get(endpoint, { transformResponse });

    return data;
}

/**
 * Fetches a profile's institution memberships.
 *
 * @param profileId - The ID of the profile
 */
export async function readProfileInstitutionMemberships(
    profileId: string,
): Promise<InstitutionMembership[]> {
    const endpoint = endpoints.profiles.institutions.memberships.replace('{id}', profileId);

    const transformResponse = transformResponseFactory(parseInstitutionMembershipResponse);

    const { data } = await client.get(endpoint, { transformResponse });

    return data;
}
