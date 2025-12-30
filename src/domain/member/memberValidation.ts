import { v, optional } from '@/utils/forms/validation';

/**
 * Validation rules for CreateRoleRequest
 */
export const createRoleRequestValidation = {
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
export const updateRoleRequestValidation = {
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
export const updateMemberRequestValidation = {
    roleId: {
        numeric: optional(v.numeric('roleId')),
    },
};

/**
 * Validation rules for CreateMemberRequest
 */
export const createMemberRequestValidation = {
    username: {
        required: v.required('username'),
        maxLength: v.maxLength('username', 50),
    },
    roleId: {
        numeric: optional(v.numeric('roleId')),
    },
};

export type CreateRoleRequestValidation = typeof createRoleRequestValidation;
export type UpdateRoleRequestValidation = typeof updateRoleRequestValidation;
export type UpdateMemberRequestValidation = typeof updateMemberRequestValidation;
export type CreateMemberRequestValidation = typeof createMemberRequestValidation;
