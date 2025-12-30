import {
    required,
    email,
    numeric,
    minValue,
    maxValue,
    minLength,
    maxLength,
    sameAs,
    url,
    alphaNum,
    between,
    helpers,
} from '@vuelidate/validators';
import { i18n, DEFAULT_LOCALE } from '@/config/i18nConfig';
import type { TranslationRequest } from '@/domain/translation';

function getFieldName(field: string): string {
    const key = `validation.fields.${field}`;
    const translated = i18n.global.t(key);
    return translated === key ? field : translated;
}

function createMessage(validatorKey: string, field: string, params?: Record<string, any>): string {
    const fieldName = getFieldName(field);

    return i18n.global.t(`validation.${validatorKey}`, {
        field: fieldName,
        ...params,
    });
}

/**
 * Helper to create optional validation rules (only validate if value exists)
 */
export function optional(validator: any): any {
    return helpers.withParams({ type: 'optional' }, (value: any) => {
        if (value === null || value === undefined || value === '') return true;
        return helpers.unwrap(validator)(value);
    });
}

/**
 * Validation rule builder with i18n support
 * All validators are namespaced under this object for consistency
 */
export const v = {
    // Standard validators
    required: (field: string) =>
        helpers.withMessage(() => createMessage('required', field), required),

    email: (field: string) => helpers.withMessage(() => createMessage('email', field), email),

    numeric: (field: string) => helpers.withMessage(() => createMessage('numeric', field), numeric),

    minValue: (field: string, min: number) =>
        helpers.withMessage(() => createMessage('minValue', field, { min }), minValue(min)),

    maxValue: (field: string, max: number) =>
        helpers.withMessage(() => createMessage('maxValue', field, { max }), maxValue(max)),

    minLength: (field: string, min: number) =>
        helpers.withMessage(() => createMessage('minLength', field, { min }), minLength(min)),

    maxLength: (field: string, max: number) =>
        helpers.withMessage(() => createMessage('maxLength', field, { max }), maxLength(max)),

    sameAs: (field: string, other: string, otherField: any) =>
        helpers.withMessage(
            () => createMessage('sameAs', field, { other: getFieldName(other) }),
            sameAs(otherField),
        ),

    url: (field: string) => helpers.withMessage(() => createMessage('url', field), url),

    alphaNum: (field: string) =>
        helpers.withMessage(() => createMessage('alphaNum', field), alphaNum),

    between: (field: string, min: number, max: number) =>
        helpers.withMessage(() => createMessage('between', field, { min, max }), between(min, max)),

    // Custom validators
    endTimeAfterStartTime: helpers.withMessage(
        () => i18n.global.t('validation.custom.endTimeAfterStartTime'),
        (value: any, siblings: any): boolean => {
            if (!value || !siblings.startTime) return true;
            const start = siblings.startTime.split(':').map(Number);
            const end = value.split(':').map(Number);
            return end[0] > start[0] || (end[0] === start[0] && end[1] > start[1]);
        },
    ),

    translationRequired: (field: string, locale: string = DEFAULT_LOCALE) =>
        helpers.withMessage(
            () =>
                i18n.global.t('validation.custom.translationRequired', {
                    locale: locale.toUpperCase(),
                }),
            (value: TranslationRequest | null | undefined): boolean => {
                if (!value) return false;
                return Boolean(value[locale] && value[locale]?.trim());
            },
        ),

    translationAllRequired: (field: string, locales: string[]) =>
        helpers.withMessage(
            () =>
                i18n.global.t('validation.custom.translationRequired', {
                    locale: locales.map((l) => l.toUpperCase()).join(', '),
                }),
            (value: TranslationRequest | null | undefined): boolean => {
                if (!value) return false;
                return locales.every((locale) => Boolean(value[locale] && value[locale]?.trim()));
            },
        ),
};

/**
 * Type-safe validation builder
 */
export type ValidationRules = Record<string, Record<string, any>>;
