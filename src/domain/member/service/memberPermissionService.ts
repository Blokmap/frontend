import { blank } from '../helpers';
import { isAdministrator } from '../helpers/memberPermissionHelpers';
import type { Predicate, Role } from '../types';
import type { Profile } from '@/domain/profile';

/**
 * Checks if a role satisfies the given permission predicate.
 *
 * @param role - The role to check.
 * @param predicate - The permission predicate to evaluate. Defaults to a predicate that always returns true.
 *
 * @returns A promise that resolves to true if the role satisfies the predicate, false otherwise.
 */
export function checkRolePermission(
    profile: Profile,
    role: Role,
    predicate: Predicate = blank(),
): boolean {
    if (profile.isAdmin) return true;
    if (isAdministrator(role.permissions)) return true;
    return predicate(role.permissions);
}
