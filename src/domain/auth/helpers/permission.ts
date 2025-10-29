/**
 * Check if the actual permissions include the expected permissions.
 *
 * @param actual - The actual permission bitmask.
 * @param expected - The expected permission bitmask.
 * @returns True if actual includes expected, false otherwise.
 */
export function checkPermissions(actual: number, expected: number): boolean {
    return (actual & 0b1) === 0b1 || (actual & expected) === expected;
}
