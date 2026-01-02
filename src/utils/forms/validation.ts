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
import { i18n } from '@/config/i18nConfig';

export function optional(validator: any): any {
    return helpers.withParams({ type: 'optional' }, (value: any) => {
        if (value === null || value === undefined || value === '') {
            return true;
        }

        return helpers.unwrap(validator)(value);
    });
}

/**
 * Validation rule builder with i18n support
 * All validators are namespaced under this object for consistency
 */
export const v = {
    required(field: string) {
        const message = () => createMessage('required', field);
        return helpers.withMessage(message, required);
    },

    email(field: string) {
        const message = () => createMessage('email', field);
        return helpers.withMessage(message, email);
    },

    numeric(field: string) {
        const message = () => createMessage('numeric', field);
        return helpers.withMessage(message, numeric);
    },

    minValue(field: string, min: number) {
        const message = () => createMessage('minValue', field, { min });
        return helpers.withMessage(message, minValue(min));
    },

    maxValue(field: string, max: number) {
        const message = () => createMessage('maxValue', field, { max });
        return helpers.withMessage(message, maxValue(max));
    },

    minLength(field: string, min: number) {
        const message = () => createMessage('minLength', field, { min });
        return helpers.withMessage(message, minLength(min));
    },

    maxLength(field: string, max: number) {
        const message = () => createMessage('maxLength', field, { max });
        return helpers.withMessage(message, maxLength(max));
    },

    sameAs(field: string, other: string, otherField: any) {
        const message = () => createMessage('sameAs', field, { other: getFieldName(other) });
        return helpers.withMessage(message, sameAs(otherField));
    },

    url(field: string) {
        const message = () => createMessage('url', field);
        return helpers.withMessage(message, url);
    },

    alphaNum(field: string) {
        const message = () => createMessage('alphaNum', field);
        return helpers.withMessage(message, alphaNum);
    },

    between(field: string, min: number, max: number) {
        const message = () => createMessage('between', field, { min, max });
        return helpers.withMessage(message, between(min, max));
    },
};

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
