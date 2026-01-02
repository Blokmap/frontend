import { SUPPORTED_LOCALES } from '@/config/i18nConfig';
import type { ValidationArgs } from '@vuelidate/core';

export function translationRequestRules(
    locales: readonly string[] = SUPPORTED_LOCALES,
    rules: ValidationArgs = {},
): Record<string, ValidationArgs> {
    return Object.fromEntries(locales.map((locale) => [locale, rules]));
}
