/**
 * Utility function to format an array of includes into a record.
 *
 * @param includes - Array of strings representing the includes to format.
 * Each string should correspond to a property in the Reservation model.
 * @example
 * formatIncludes(['profile', 'location']) // { profile: true, location: true }
 * @returns {Record<string, boolean>} - A record with the included properties set to true.
 */
export function formatIncludes(includes: string[]): Record<string, boolean> {
    return includes.reduce(
        (acc, include) => {
            acc[include] = true;
            return acc;
        },
        {} as Record<string, boolean>,
    );
}
