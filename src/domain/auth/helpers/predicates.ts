import { checkPermissions } from './permissionHelpers';
import type { Predicate } from '../types/predicateTypes';

/**
 * Creates a predicate that returns true if ANY of the given permissions/predicates are satisfied.
 * Also returns true if the user has administrator privileges.
 *
 * @param items - Permission bitmasks or predicate functions to check
 * @returns Predicate function
 *
 */
export function any(...items: (number | Predicate)[]): Predicate {
    return (perms: number) =>
        items.some((item) =>
            typeof item === 'function' ? item(perms) : checkPermissions(perms, item),
        );
}

/**
 * Creates a predicate that returns true if ALL of the given permissions/predicates are satisfied.
 * Also returns true if the user has administrator privileges.
 *
 * @param items - Permission bitmasks or predicate functions to check
 * @returns Predicate function
 */
export function all(...items: (number | Predicate)[]): Predicate {
    return (perms: number) =>
        items.every((item) =>
            typeof item === 'function' ? item(perms) : checkPermissions(perms, item),
        );
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
