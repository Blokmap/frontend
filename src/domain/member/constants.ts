import {
    LocationPermission,
    AuthorityPermission,
    InstitutionPermission,
    type PermissionType,
} from './types/permission';

/**
 * The administrator permission bit flag (1 << 0 = 0b1).
 * When a role has this permission, it has full access to all features.
 */
export const ADMINISTRATOR_PERMISSION = 0b1;

export const LOCATION_PERMISSIONS = {
    Administrator: LocationPermission.Administrator,
    ManageImages: LocationPermission.ManageImages,
    ManageMembers: LocationPermission.ManageMembers,
    ManageOpeningTimes: LocationPermission.ManageOpeningTimes,
    ManageReservations: LocationPermission.ManageReservations,
} as const;

export const AUTHORITY_PERMISSIONS = {
    Administrator: AuthorityPermission.Administrator,
    AddLocations: AuthorityPermission.AddLocations,
    ApproveLocations: AuthorityPermission.ApproveLocations,
    DeleteLocations: AuthorityPermission.DeleteLocations,
    ManageMembers: AuthorityPermission.ManageMembers,
} as const;

export const INSTITUTION_PERMISSIONS = {
    Administrator: InstitutionPermission.Administrator,
    AddAuthority: InstitutionPermission.AddAuthority,
    DeleteAuthority: InstitutionPermission.DeleteAuthority,
    ManageMembers: InstitutionPermission.ManageMembers,
} as const;

export const PERMISSIONS: Record<PermissionType, Record<string, number>> = {
    location: LOCATION_PERMISSIONS,
    authority: AUTHORITY_PERMISSIONS,
    institution: INSTITUTION_PERMISSIONS,
} as const;
