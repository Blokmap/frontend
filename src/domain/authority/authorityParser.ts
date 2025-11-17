import { parseLocationResponse } from '@/domain/location';
import { parseProfileResponse } from '@/domain/profile';
import type { Authority } from './types';

/**
 * Parses an Authority response object.
 *
 * @param data - The raw authority data from the API.
 * @returns The parsed Authority object.
 */
export function parseAuthorityResponse(data: any): Authority {
    const result: Authority = {
        ...data,
    };

    if (data.createdBy) {
        result.createdBy = parseProfileResponse(data.createdBy);
    }

    if (data.updatedBy) {
        result.updatedBy = parseProfileResponse(data.updatedBy);
    }

    if (data.members) {
        result.members = data.members.map(parseProfileResponse);
    }

    if (data.locations) {
        result.locations = data.locations.map(parseLocationResponse);
    }

    return result;
}
