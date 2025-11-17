import { parseAuthorityResponse } from '@/domain/authority';
import { parseImageResponse } from '@/domain/image';
import { parseInstitutionResponse } from '@/domain/institution';
import { stringToDate } from '@/utils/date';
import type { FoundProfile, Profile } from './types';

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
 * Parses a found profile response object (simplified profile for search results).
 *
 * @param data - The raw found profile data from the API.
 * @returns The parsed FoundProfile object.
 */
export function parseFoundProfileResponse(data: any): FoundProfile {
    if (!data) return data;

    return {
        ...data,
        avatarUrl: parseImageResponse(data.avatarUrl),
    };
}
