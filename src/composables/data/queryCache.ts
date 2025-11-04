import type { Paginated } from '@/utils/pagination';
import type { QueryClient, QueryKey } from '@tanstack/vue-query';

/**
 * Invalidates only queries that contain a specific item by its id.
 *
 * @param queryClient - The QueryClient instance.
 * @param itemId - The id of the item to look for.
 * @param key - The base key with an all() method to get all query keys.
 *
 * @returns void
 */
export function invalidateQueries<T extends { id: number | string }>(
    queryClient: QueryClient,
    queryKey: QueryKey,
    itemId?: number | string,
) {
    if (!itemId) {
        return queryClient.invalidateQueries({ queryKey });
    }

    const cache = queryClient.getQueryCache();
    const queries = cache.findAll({ queryKey });

    for (const query of queries) {
        const data = query.state.data;

        if (queryContainsItem<T>(data, itemId)) {
            queryClient.invalidateQueries({ queryKey: query.queryKey });
        }
    }
}

/**
 * Helper to check if data contains an item with a specific id
 */
function queryContainsItem<T extends { id: number | string }>(
    data: any,
    itemId: number | string,
): boolean {
    if (!data) return false;

    // Single item
    if (isSingleItem<T>(data)) {
        return data.id === itemId;
    }

    // Paginated list
    if (isPaginated<T>(data)) {
        return data.data.some((item) => item.id === itemId);
    }

    // Plain array
    if (Array.isArray(data)) {
        return data.some((item) => item.id === itemId);
    }

    return false;
}

/**
 * Helper to check if data is paginated
 */
function isPaginated<T>(data: any): data is Paginated<T> {
    return data && 'data' in data && Array.isArray(data.data);
}

/**
 * Helper to check if data is a single item with an id
 */
function isSingleItem<T extends { id: number | string }>(data: any): data is T {
    return data && 'id' in data;
}
