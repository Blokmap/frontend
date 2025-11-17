import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { transformPaginatedResponseFactory, transformResponseFactory } from '@/utils/serviceUtils';
import {
    parseAuthorityMembershipResponse,
    parseInstitutionMembershipResponse,
    parseLocationMembershipResponse,
    parseMemberResponse,
} from '../memberParser';
import type {
    AuthorityMembership,
    CreateMemberBody,
    InstitutionMembership,
    LocationMembership,
    Member,
    MemberFilter,
    RecursivePermissions,
    UpdateMemberBody,
} from '../types';
import type { Paginated } from '@/utils/pagination';

export * from './memberRoleService';
export * from './memberPermissionService';

/**
 * Fetches the members for a specific location.
 */
export async function readLocationMembers(
    locationId: number,
    filters: MemberFilter,
): Promise<Paginated<LocationMembership>> {
    const endpoint = endpoints.locations.members.list.replace('{id}', locationId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseMemberResponse);

    const { data } = await client.get(endpoint, { params: filters, transformResponse });

    return data;
}

/**
 * Adds a member to a specific location.
 *
 * @param locationId - The ID of the location
 * @param body - The member body containing the username and role ID
 */
export async function addLocationMember(locationId: number, body: CreateMemberBody): Promise<void> {
    const endpoint = endpoints.locations.members.add.replace('{id}', locationId.toString());

    await client.post(endpoint, body);
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
    body: UpdateMemberBody,
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
 * @param body - The member body containing the username and role ID
 */
export async function addAuthorityMember(
    authorityId: number,
    body: CreateMemberBody,
): Promise<void> {
    const endpoint = endpoints.authorities.members.add.replace('{id}', authorityId.toString());

    await client.post(endpoint, body);
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
    body: UpdateMemberBody,
): Promise<void> {
    const endpoint = endpoints.authorities.members.update
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
 * @param body - The member body containing the username and role ID
 */
export async function addInstitutionMember(
    institutionId: number,
    body: CreateMemberBody,
): Promise<void> {
    const endpoint = endpoints.institutions.members.add.replace('{id}', institutionId.toString());

    await client.post(endpoint, body);
}

/**
 * Updates a member's role in a specific institution.
 */
export async function updateInstitutionMember(
    institutionId: number,
    memberId: string,
    body: UpdateMemberBody,
): Promise<void> {
    const endpoint = endpoints.institutions.members.update
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

/**
 * Fetches the recursive permissions for a member in a specific location.
 *
 * @param locationId - The ID of the location
 * @param profileId - The ID of the profile
 */
export async function readLocationMemberPermissions(
    locationId: number,
    profileId: string,
): Promise<RecursivePermissions> {
    const endpoint = endpoints.locations.members.roles
        .replace('{id}', locationId.toString())
        .replace('{profileId}', profileId.toString());

    const { data } = await client.get(endpoint);

    return data;
}

/**
 * Fetches the recursive permissions for a member in a specific authority.
 *
 * @param authorityId - The ID of the authority
 * @param profileId - The ID of the profile
 */
export async function readAuthorityMemberPermissions(
    authorityId: number,
    profileId: string,
): Promise<RecursivePermissions> {
    const endpoint = endpoints.authorities.members.roles
        .replace('{id}', authorityId.toString())
        .replace('{profileId}', profileId.toString());

    const { data } = await client.get(endpoint);

    return data;
}

/**
 * Fetches the recursive permissions for a member in a specific institution.
 *
 * @param institutionId - The ID of the institution
 * @param profileId - The ID of the profile
 */
export async function readInstitutionMemberPermissions(
    institutionId: number,
    profileId: string,
): Promise<RecursivePermissions> {
    const endpoint = endpoints.institutions.members.roles
        .replace('{id}', institutionId.toString())
        .replace('{profileId}', profileId.toString());

    const { data } = await client.get(endpoint);

    return data;
}
