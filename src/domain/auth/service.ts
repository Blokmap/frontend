import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { stringToDate } from '@/utils/date';
import { transformResponseFactory, transformPaginatedResponseFactory } from '@/utils/service';
import { parseAuthorityResponse } from '../authority';
import { parseImageResponse } from '../image';
import { parseInstitutionResponse } from '../institution';
import type { LoginRequest, Membership, RegisterRequest, Role } from './types';
import type { Profile } from '@/domain/profile';
import type { Paginated } from '@/utils/pagination';

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
 * Parses a profile response object.
 *
 * @param data - The raw profile data from the API.
 * @returns The parsed Profile object.
 */
export function parseProfileResponse(data: any): Profile {
    if (!data) return data;

    const result: Profile = {
        ...data,
        avatarUrl: parseImageResponse(data.avatarUrl),
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
    };

    if (data.institution) {
        result.institution = parseInstitutionResponse(data.institution);
    }

    if (data.authorities) {
        result.authorities = data.authorities.map(parseAuthorityResponse);
    }

    return result;
}

/**
 * Fetches the authenticated user's profile.
 *
 * @returns The authenticated user's profile or null if not authenticated.
 */
export async function readAuthProfile(): Promise<Profile | null> {
    const endpoint = endpoints.auth.current;

    const transformResponse = transformResponseFactory(parseProfileResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    if (data === null) return null;

    return data;
}

/**
 * Registers a new user with the provided registration details.
 *
 * @param request - The registration request containing user details.
 * @returns A promise that resolves when the registration is successful.
 */
export async function register(request: RegisterRequest): Promise<void> {
    const endpoint = endpoints.auth.register;
    await client.post(endpoint, request);
}

/**
 * Logs in the user with the provided credentials.
 *
 * @param request - The login request containing email and password.
 * @returns A promise that resolves when the login is successful.
 */
export async function login(request: LoginRequest): Promise<void> {
    const endpoint = endpoints.auth.login;
    await client.post(endpoint, request);
}

/**
 * Logs out the user by invalidating the current session.
 *
 * @returns A promise that resolves when the logout is successful.
 */
export async function logout(): Promise<void> {
    const endpoint = endpoints.auth.logout;
    await client.post(endpoint);
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
