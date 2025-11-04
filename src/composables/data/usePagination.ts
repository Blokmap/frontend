import { computed, type Ref } from 'vue';
import type { Pagination } from '@/utils/pagination';

/**
 * Composable for managing pagination state with a filters object.
 *
 * This composable syncs pagination state with a filters ref that contains
 * page and perPage properties, and provides utility functions for PrimeVue Paginator.
 *
 * @param pagination - A ref to a pagination object
 * @returns An object containing pagination controls
 */
export function usePagination(pagination: Ref<Pagination>) {
    /**
     * Handle page change event.
     * Updates the filters ref with the new page number.
     *
     * @param event - The pagination event containing the new page index
     */
    const onPageChange = (event: { page: number }): void => {
        pagination.value.page = event.page + 1;
    };

    /**
     * Reset pagination to the first page.
     * Useful when filters change or data is refreshed.
     */
    const resetPage = (): void => {
        pagination.value.page = 1;
    };

    /**
     * Computed property for the first record index (0-indexed).
     */
    const first = computed(() => {
        const page = pagination.value.page ?? 1;
        const perPage = pagination.value.perPage ?? 25;
        return perPage * (page - 1);
    });

    return {
        onPageChange,
        resetPage,
        first,
    };
}
