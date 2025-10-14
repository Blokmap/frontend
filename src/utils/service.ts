import type { Paginated } from '@/utils/pagination';

/**
 * Utility function to format an array of includes into a record.
 *
 * @param includes - Array of strings representing the includes to format.
 * @returns {Record<string, boolean>} - A record with the included properties set to true.
 */
export function formatIncludes(includes: string[]): Record<string, boolean> {
    const acc = {} as Record<string, boolean>;

    return includes.reduce((acc, include) => {
        acc[include] = true;
        return acc;
    }, acc);
}

/**
 * Transforms a paginated response by parsing each item using the provided parser function.
 *
 * @param parser - A function that takes an item and returns the parsed item.
 * @returns A function that takes a JSON string and returns a Paginated object with parsed items.
 */
export function transformPaginatedResponse<T>(
    parser: (item: any) => T,
): (data: string) => Paginated<T> {
    return (data: string) => {
        const parsed = JSON.parse(data);
        const items = parsed.data.map(parser);
        return {
            ...parsed,
            data: items,
        };
    };
}
