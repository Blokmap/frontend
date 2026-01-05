import { ADMINISTRATOR_PERMISSION, PERMISSIONS } from '../constants/permissionConstants';
import type { PermissionType } from '../types/permissionTypes';

/**
 * Check if the actual permissions include the expected permissions.
 *
 * @param actual - The actual permission bitmask.
 * @param expected - The expected permission bitmask.
 * @returns True if actual includes expected, false otherwise.
 */
export function checkPermissions(actual: number, expected: number): boolean {
    return isAdministrator(actual) || (actual & expected) === expected;
}

/**
 * Check if a permission bitmask has administrator privileges.
 *
 * @param permissions - The permission bitmask to check.
 * @returns True if the permissions include administrator privilege.
 */
export function isAdministrator(permissions: number): boolean {
    return (permissions & ADMINISTRATOR_PERMISSION) === ADMINISTRATOR_PERMISSION;
}

/**
 * Extract individual permissions from a permission bitmask.
 * Returns an array of [label, value] tuples for each permission that is set.
 * If the bitmask has administrator permission, only returns the administrator entry.
 *
 * @param permissions - The permission bitmask to extract from.
 * @param type - The type of permissions (location, authority, or institution).
 * @returns Array of [label, value] tuples for each set permission.
 */
export function extractPermissions(
    permissions: number,
    type: PermissionType,
): Array<[string, number]> {
    const permissionMap = PERMISSIONS[type];

    // If administrator, return only administrator permission
    if (isAdministrator(permissions)) {
        return [['Administrator', ADMINISTRATOR_PERMISSION]];
    }

    // Otherwise, return all set permissions
    return Object.entries(permissionMap).filter(([_, value]) => {
        return (permissions & value) === value;
    });
}
