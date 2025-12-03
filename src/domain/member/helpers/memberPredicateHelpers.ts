import { checkPermissions } from './memberPermissionHelpers';
import type { Predicate } from '../types';

/**
 * Creates a predicate that returns true if ANY of the given permissions are present.
 * Also returns true if the user has administrator privileges.
 *
 * @param permissions - Permission bitmasks to check
 * @returns Predicate function
 *
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
 */
export function not(predicate: Predicate): Predicate {
    return (perms: number) => !predicate(perms);
}

/**
 * Creates a predicate that always returns true.
 * Useful for routes that only require membership without specific permissions.
 *
 * @returns Predicate that always returns true
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
 */
export function has(permission: number): Predicate {
    return (perms: number) => checkPermissions(perms, permission);
}
