import type { Translation, TranslationBody } from './types';

/**
 * Converts a Translation object to a TranslationBody object for updating.
 *
 * @param translation - The translation object to convert.
 * @returns
 */
export function translationToBody(translation: Translation): TranslationBody {
    return { ...translation };
}
