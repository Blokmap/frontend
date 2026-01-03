import { SUPPORTED_LOCALES, type SupportedLocale } from '@/config/i18nConfig';
import type { Validation, ValidationArgs } from '@vuelidate/core';

export function focusInvalidLocale(error: Record<string, Validation>): SupportedLocale | undefined {
    for (const locale of SUPPORTED_LOCALES) {
        if (error[locale]?.$error) return locale;
    }
}

export function translationRequestRules(
    locales: readonly SupportedLocale[] = SUPPORTED_LOCALES,
    rules: ValidationArgs = {},
): Record<SupportedLocale, ValidationArgs> {
    return Object.fromEntries(locales.map((locale) => [locale, rules])) as Record<
        SupportedLocale,
        ValidationArgs
    >;
}
