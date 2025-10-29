import type { Translation } from './types';

/**
 * Parses a Translation response object.
 *
 * @param data - The raw translation data from the API.
 * @returns The parsed Translation object.
 */
export function parseTranslationResponse(data: any): Translation {
    if (!data) return data;

    const result: Translation = {
        ...data,
    };

    return result;
}
