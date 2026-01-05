import { DEFAULT_LOCALE } from '@/config/i18nConfig';
import { v, optional } from '@/utils/forms/validation';
import { translationRequestRules } from '../translation';

/**
 * Validation rules for InstitutionRequest
 */
export const institutionRequestRules = {
    category: {
        required: v.required('category'),
    },
    name: translationRequestRules([DEFAULT_LOCALE], {
        required: v.required('name'),
    }),
    slug: {
        required: v.required('slug'),
        maxLength: v.maxLength('slug', 100),
    },
    aclType: {
        required: v.required('aclType'),
    },
    city: {
        maxLength: optional(v.maxLength('city', 255)),
    },
    zip: {
        maxLength: optional(v.maxLength('zip', 20)),
    },
    country: {
        maxLength: optional(v.maxLength('country', 100)),
    },
    number: {
        maxLength: optional(v.maxLength('number', 50)),
    },
    street: {
        maxLength: optional(v.maxLength('street', 255)),
    },
    province: {
        maxLength: optional(v.maxLength('province', 255)),
    },
    email: {
        email: optional(v.email('email')),
        maxLength: optional(v.maxLength('email', 255)),
    },
    phoneNumber: {
        maxLength: optional(v.maxLength('phoneNumber', 20)),
    },
};

export type InstitutionRequestRules = typeof institutionRequestRules;
