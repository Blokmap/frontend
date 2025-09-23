import type { Paginated } from '../types';

/**
 * Check if there are more pages available in a paginated result
 *
 * @param paginated - The paginated result to check
 * @returns True if there are more pages available
 */
export function hasNextPage<T>(paginated: Paginated<T>): boolean {
    return paginated.page * paginated.perPage < paginated.total;
}

/**
 * Check if there are previous pages available in a paginated result
 *
 * @param paginated - The paginated result to check
 * @returns True if there are previous pages available
 */
export function hasPreviousPage<T>(paginated: Paginated<T>): boolean {
    return paginated.page > 1;
}

/**
 * Get the total number of pages for a paginated result
 *
 * @param paginated - The paginated result
 * @returns The total number of pages
 */
export function getTotalPages<T>(paginated: Paginated<T>): number {
    return Math.ceil(paginated.total / paginated.perPage);
}
