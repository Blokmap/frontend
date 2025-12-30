import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { transformResponseFactory } from '@/utils/serviceUtils';
import { parseRoleResponse } from '../memberParser';
import type { CreateRoleRequest, Role, UpdateRoleRequest } from '../types';

/**
 * Fetches the roles for a specific location.
 *
 * @param locationId - The ID of the location.
 * @returns A promise that resolves to an array of roles for the specified location.
 */
export async function readLocationRoles(locationId: number): Promise<Role[]> {
    const endpoint = endpoints.locations.roles.list.replace('{id}', locationId.toString());

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
    const endpoint = endpoints.authorities.roles.list.replace('{id}', authorityId.toString());

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
    const endpoint = endpoints.institutions.roles.list.replace('{id}', institutionId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Creates a new role for a specific location.
 *
 * @param locationId - The ID of the location.
 * @param body - The role data to create.
 * @returns A promise that resolves to the created role.
 */
export async function createLocationRole(
    locationId: number,
    body: CreateRoleRequest,
): Promise<Role> {
    const endpoint = endpoints.locations.roles.create.replace('{id}', locationId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Updates an existing role for a specific location.
 *
 * @param locationId - The ID of the location.
 * @param roleId - The ID of the role to update.
 * @param body - The role data to update.
 * @returns A promise that resolves to the updated role.
 */
export async function updateLocationRole(
    locationId: number,
    roleId: number,
    body: UpdateRoleRequest,
): Promise<Role> {
    const endpoint = endpoints.locations.roles.update
        .replace('{id}', locationId.toString())
        .replace('{roleId}', roleId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.patch(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Deletes a role for a specific location.
 *
 * @param locationId - The ID of the location.
 * @param roleId - The ID of the role to delete.
 * @returns A promise that resolves when the role is deleted.
 */
export async function deleteLocationRole(locationId: number, roleId: number): Promise<void> {
    const endpoint = endpoints.locations.roles.delete
        .replace('{id}', locationId.toString())
        .replace('{roleId}', roleId.toString());

    await client.delete(endpoint);
}

/**
 * Creates a new role for a specific authority.
 *
 * @param authorityId - The ID of the authority.
 * @param body - The role data to create.
 * @returns A promise that resolves to the created role.
 */
export async function createAuthorityRole(
    authorityId: number,
    body: CreateRoleRequest,
): Promise<Role> {
    const endpoint = endpoints.authorities.roles.create.replace('{id}', authorityId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Updates an existing role for a specific authority.
 *
 * @param authorityId - The ID of the authority.
 * @param roleId - The ID of the role to update.
 * @param body - The role data to update.
 * @returns A promise that resolves to the updated role.
 */
export async function updateAuthorityRole(
    authorityId: number,
    roleId: number,
    body: UpdateRoleRequest,
): Promise<Role> {
    const endpoint = endpoints.authorities.roles.update
        .replace('{id}', authorityId.toString())
        .replace('{roleId}', roleId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.patch(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Deletes a role for a specific authority.
 *
 * @param authorityId - The ID of the authority.
 * @param roleId - The ID of the role to delete.
 * @returns A promise that resolves when the role is deleted.
 */
export async function deleteAuthorityRole(authorityId: number, roleId: number): Promise<void> {
    const endpoint = endpoints.authorities.roles.delete
        .replace('{id}', authorityId.toString())
        .replace('{roleId}', roleId.toString());

    await client.delete(endpoint);
}

/**
 * Creates a new role for a specific institution.
 *
 * @param institutionId - The ID of the institution.
 * @param body - The role data to create.
 * @returns A promise that resolves to the created role.
 */
export async function createInstitutionRole(
    institutionId: number,
    body: CreateRoleRequest,
): Promise<Role> {
    const endpoint = endpoints.institutions.roles.create.replace('{id}', institutionId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Updates an existing role for a specific institution.
 *
 * @param institutionId - The ID of the institution.
 * @param roleId - The ID of the role to update.
 * @param body - The role data to update.
 * @returns A promise that resolves to the updated role.
 */
export async function updateInstitutionRole(
    institutionId: number,
    roleId: number,
    body: UpdateRoleRequest,
): Promise<Role> {
    const endpoint = endpoints.institutions.roles.update
        .replace('{id}', institutionId.toString())
        .replace('{roleId}', roleId.toString());

    const transformResponse = transformResponseFactory(parseRoleResponse);

    const { data } = await client.patch(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Deletes a role for a specific institution.
 *
 * @param institutionId - The ID of the institution.
 * @param roleId - The ID of the role to delete.
 * @returns A promise that resolves when the role is deleted.
 */
export async function deleteInstitutionRole(institutionId: number, roleId: number): Promise<void> {
    const endpoint = endpoints.institutions.roles.delete
        .replace('{id}', institutionId.toString())
        .replace('{roleId}', roleId.toString());

    await client.delete(endpoint);
}
