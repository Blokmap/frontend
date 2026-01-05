import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import type { RecursivePermissions } from '../types/permissionTypes';

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
