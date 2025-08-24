/**
 * Base permission type - represents a numeric bitflag value
 */
export type Permission = number;

/**
 * Permission domain type
 */
export type PermissionDomain = 'location' | 'authority' | 'institution';

/**
 * Location permissions bitflags
 */
export const LP = {
    Administrator: 1 << 0,
    ManageLocation: 1 << 1,
    DeleteLocation: 1 << 2,
    ManageOpeningTimes: 1 << 3,
    ManageReservations: 1 << 4,
    ManageMembers: 1 << 5,
} as const;

/**
 * Authority permissions bitflags
 */
export const AP = {
    Administrator: 1 << 0,
    ManageAuthority: 1 << 1,
    ManageLocation: 1 << 2,
    AddLocation: 1 << 3,
    ApproveLocation: 1 << 4,
    DeleteLocation: 1 << 5,
    ManageOpeningTimes: 1 << 6,
    ManageReservations: 1 << 7,
    ManageMembers: 1 << 8,
} as const;

/**
 * Institution permissions bitflags
 */
export const IP = {
    Administrator: 1 << 0,
} as const;
