import type { Translation, TranslationRequest } from './types';

/**
 * Converts a Translation object to a TranslationRequest object for updating.
 *
 * @param translation - The translation object to convert.
 * @returns
 */
export function translationToRequest(translation: Translation): TranslationRequest {
    return { ...translation };
}
