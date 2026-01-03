import { DEFAULT_LOCALE } from '@/config/i18nConfig';
import { translationRequestRules } from '@/domain/translation';
import { v, optional } from '@/utils/forms/validation';

/**
 * Validation rules for LocationRequest
 */
export const locationRequestRules = {
    name: {
        required: v.required('name'),
        maxLength: v.maxLength('name', 255),
    },
    description: translationRequestRules([DEFAULT_LOCALE], {
        required: v.required('description'),
    }),
    excerpt: translationRequestRules([DEFAULT_LOCALE], {
        required: v.required('excerpt'),
    }),
    seatCount: {
        required: v.required('seatCount'),
        numeric: v.numeric('seatCount'),
        minValue: v.minValue('seatCount', 1),
    },
    isReservable: {},
    isVisible: {},
    street: {
        required: v.required('street'),
        maxLength: v.maxLength('street', 255),
    },
    number: {
        required: v.required('number'),
        maxLength: v.maxLength('number', 50),
    },
    zip: {
        required: v.required('zip'),
        maxLength: v.maxLength('zip', 20),
    },
    city: {
        required: v.required('city'),
        maxLength: v.maxLength('city', 255),
    },
    country: {
        required: v.required('country'),
        maxLength: v.maxLength('country', 100),
    },
    latitude: {
        required: v.required('latitude'),
        numeric: v.numeric('latitude'),
    },
    longitude: {
        required: v.required('longitude'),
        numeric: v.numeric('longitude'),
    },
    parent: {},
    authorityId: {},
    institutionId: {},
};

/**
 * Validation rules for LocationStateRequest
 */
export const locationStateRequestRules = {
    state: {
        required: v.required('state'),
    },
    reason: {
        maxLength: optional(v.maxLength('reason', 500)),
    },
};

export type LocationRequestRules = typeof locationRequestRules;
export type LocationStateRequestRules = typeof locationStateRequestRules;
