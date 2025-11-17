import { parseAuthorityResponse } from '@/domain/authority';
import { parseInstitutionResponse } from '@/domain/institution';
import { parseLocationResponse } from '@/domain/location';
import { parseProfileResponse } from '@/domain/profile';
import { stringToDate } from '@/utils/date';
import type {
    AuthorityMembership,
    InstitutionMembership,
    LocationMembership,
    Member,
    Role,
} from './types';

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
        addedAt: stringToDate(data.addedAt),
    };
}
