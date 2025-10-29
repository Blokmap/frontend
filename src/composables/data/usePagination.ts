import { computed, type Ref } from 'vue';
import type { Pagination } from '@/utils/pagination';

/**
 * Composable for managing pagination state with a filters object.
 *
 * This composable syncs pagination state with a filters ref that contains
 * page and perPage properties, and provides utility functions for PrimeVue Paginator.
 *
 * @param filters - A ref to a filters object containing page and perPage
 * @returns An object containing pagination controls
 */
export function usePagination(filters: Ref<Pagination & Record<string, any>>) {
    /**
     * Handle page change event.
     * Updates the filters ref with the new page number.
     *
     * @param event - The pagination event containing the new page index
     */
    const onPageChange = (event: { page: number }): void => {
        filters.value.page = event.page + 1;
    };

    /**
     * Reset pagination to the first page.
     * Useful when filters change or data is refreshed.
     */
    const resetPage = (): void => {
        filters.value.page = 1;
    };

    /**
     * Computed property for the first record index (0-indexed).
     */
    const first = computed(() => {
        const page = filters.value.page ?? 1;
        const perPage = filters.value.perPage ?? 25;
        return perPage * (page - 1);
    });

    return {
        onPageChange,
        resetPage,
        first,
    };
}
