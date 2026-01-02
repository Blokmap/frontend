import { v, optional } from '@/utils/forms/validation';

/**
 * Validation rules for AuthorityRequest
 */
export const authorityRequestRules = {
    name: {
        required: v.required('name'),
        maxLength: v.maxLength('name', 255),
    },
    description: {
        maxLength: optional(v.maxLength('description', 1000)),
    },
    institutionId: {},
};

export type AuthorityRequestRules = typeof authorityRequestRules;
