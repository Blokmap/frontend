import { checkPermissions } from './memberPermissionHelpers';
import type { Predicate } from '../types';

// Functions for building permission predicates

/**
 * Creates a predicate that returns true if ANY of the given permissions are present.
 * Also returns true if the user has administrator privileges.
 *
 * @param permissions - Permission bitmasks to check
 * @returns Predicate function
 *
 * @example
 * // User needs ManageImages OR ManageMembers
 * any(LocationPermission.ManageImages, LocationPermission.ManageMembers)
 */
export function any(...permissions: number[]): Predicate {
    return (perms: number) => permissions.some((permission) => checkPermissions(perms, permission));
}

/**
 * Creates a predicate that returns true if ALL of the given permissions are present.
 * Also returns true if the user has administrator privileges.
 *
 * @param permissions - Permission bitmasks to check
 * @returns Predicate function
 *
 * @example
 * // User needs BOTH ManageImages AND ManageMembers
 * all(LocationPermission.ManageImages, LocationPermission.ManageMembers)
 */
export function all(...permissions: number[]): Predicate {
    return (perms: number) =>
        permissions.every((permission) => checkPermissions(perms, permission));
}

/**
 * Creates a predicate that inverts another predicate.
 *
 * @param predicate - Predicate to invert
 * @returns Inverted predicate function
 *
 * @example
 * // User must NOT have ManageMembers
 * not(has(LocationPermission.ManageMembers))
 */
export function not(predicate: Predicate): Predicate {
    return (perms: number) => !predicate(perms);
}

/**
 * Creates a predicate that always returns true.
 * Useful for routes that only require membership without specific permissions.
 *
 * @returns Predicate that always returns true
 *
 * @example
 * // User just needs to be a member, no specific permissions required
 * blank()
 */
export function blank(): Predicate {
    return (_perms: number) => true;
}

/**
 * Creates a predicate that checks if a specific permission is present.
 * Also returns true if the user has administrator privileges.
 *
 * @param permission - Permission bitmask to check
 * @returns Predicate function
 *
 * @example
 * // User needs ManageImages permission
 * has(LocationPermission.ManageImages)
 */
export function has(permission: number): Predicate {
    return (perms: number) => checkPermissions(perms, permission);
}
