/**
 * Utility function to format an array of includes into a record.
 *
 * @param includes - Array of strings representing the includes to format.
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
