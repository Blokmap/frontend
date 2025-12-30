import { v, optional } from '@/utils/forms/validation';

/**
 * Validation rules for ProfileRequest
 */
export const profileRequestValidation = {
    firstName: {
        maxLength: optional(v.maxLength('firstName', 100)),
    },
    lastName: {
        maxLength: optional(v.maxLength('lastName', 100)),
    },
    username: {
        required: v.required('username'),
        maxLength: v.maxLength('username', 50),
    },
};

/**
 * Validation rules for ProfileScanRequest
 */
export const profileScanRequestValidation = {
    locationId: {
        required: v.required('locationId'),
        numeric: v.numeric('locationId'),
    },
    day: {},
    time: {},
};

export type ProfileRequestValidation = typeof profileRequestValidation;
export type ProfileScanRequestValidation = typeof profileScanRequestValidation;
