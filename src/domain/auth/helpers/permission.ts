import {
    ADMINISTRATOR_PERMISSION,
    checkPermissions as memberCheckPermissions,
} from '@/domain/member';

/**
 * Check if the actual permissions include the expected permissions.
 *
 * @param actual - The actual permission bitmask.
 * @param expected - The expected permission bitmask.
 * @returns True if actual includes expected, false otherwise.
 * @deprecated Use checkPermissions from @/domain/member instead
 */
export function checkPermissions(actual: number, expected: number): boolean {
    return memberCheckPermissions(actual, expected);
}

export { ADMINISTRATOR_PERMISSION };
