import { parseImageResponse } from '@/domain/image';
import { parseTranslationResponse } from '@/domain/translation';
import type { Institution } from './types';

/**
 * Parses an Institution response object.
 *
 * @param data - The raw institution data from the API.
 * @returns The parsed Institution object.
 */
export function parseInstitutionResponse(data: any): Institution {
    const result: Institution = {
        ...data,
        name: parseTranslationResponse(data.name),
        logo: parseImageResponse(data.logo),
    };

    return result;
}
