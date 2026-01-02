import { v, optional } from '@/utils/forms/validation';

/**
 * Validation rules for CreateRoleRequest
 */
export const createRoleRequestRules = {
    name: {
        required: v.required('name'),
        maxLength: v.maxLength('name', 100),
    },
    permissions: {
        required: v.required('permissions'),
        numeric: v.numeric('permissions'),
    },
    colour: {
        required: v.required('colour'),
        maxLength: v.maxLength('colour', 7),
    },
};

/**
 * Validation rules for UpdateRoleRequest
 */
export const updateRoleRequestRules = {
    name: {
        maxLength: optional(v.maxLength('name', 100)),
    },
    permissions: {
        numeric: optional(v.numeric('permissions')),
    },
    colour: {
        maxLength: optional(v.maxLength('colour', 7)),
    },
};

/**
 * Validation rules for UpdateMemberRequest
 */
export const updateMemberRequestRules = {
    roleId: {
        numeric: optional(v.numeric('roleId')),
    },
};

/**
 * Validation rules for CreateMemberRequest
 */
export const createMemberRequestRules = {
    username: {
        required: v.required('username'),
        maxLength: v.maxLength('username', 50),
    },
    roleId: {
        numeric: optional(v.numeric('roleId')),
    },
};

export type CreateRoleRequestRules = typeof createRoleRequestRules;
export type UpdateRoleRequestRules = typeof updateRoleRequestRules;
export type UpdateMemberRequestRules = typeof updateMemberRequestRules;
export type CreateMemberRequestRules = typeof createMemberRequestRules;
