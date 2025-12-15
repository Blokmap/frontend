import type { Translation, TranslationRequest } from './translationTypes';

/**
 * Converts a Translation object to a TranslationBody object for updating.
 *
 * @param translation - The translation object to convert.
 * @returns
 */
export function translationToRequest(translation?: Translation): TranslationRequest {
    if (!translation) {
        return {};
    }

    return { ...translation };
}
