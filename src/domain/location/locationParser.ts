import { parseAuthorityResponse } from '@/domain/authority';
import { parseImageResponse } from '@/domain/image';
import { parseOpeningTimeResponse } from '@/domain/openings';
import { parseProfileResponse } from '@/domain/profile';
import { parseTranslationResponse } from '@/domain/translation';
import { stringToDate } from '@/utils/date';
import { parseInstitutionResponse } from '../institution';
import type { Location } from './types';

/**
 * Transform a Location response object.
 *
 * @param data - The raw location data from the API.
 * @returns The parsed Location object.
 */
export function parseLocationResponse(data: any): Location {
    const result: Location = {
        ...data,
        excerpt: parseTranslationResponse(data.excerpt),
        description: parseTranslationResponse(data.description),
        approvedAt: stringToDate(data.approvedAt),
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
        rejectedAt: stringToDate(data.rejectedAt),
    };

    if (data.openingTimes) {
        result.openingTimes = data.openingTimes.map(parseOpeningTimeResponse);
    }

    if (data.images) {
        result.images = data.images.map(parseImageResponse);
    }

    if (data.createdBy) {
        result.createdBy = parseProfileResponse(data.createdBy);
    }

    if (data.updatedBy) {
        result.updatedBy = parseProfileResponse(data.updatedBy);
    }

    if (data.approvedBy) {
        result.approvedBy = parseProfileResponse(data.approvedBy);
    }

    if (data.rejectedBy) {
        result.rejectedBy = parseProfileResponse(data.rejectedBy);
    }

    if (data.authority) {
        result.authority = parseAuthorityResponse(data.authority);
    }

    if (data.institution) {
        result.institution = parseInstitutionResponse(data.institution);
    }

    return result;
}
