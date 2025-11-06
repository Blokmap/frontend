import { type Ref } from 'vue';
import type { Paginated, Pagination } from '@/utils/pagination';

/**
 * Composable for managing pagination state with a filters object.
 *
 * This composable syncs pagination state with a filters ref that contains
 * page and perPage properties, and provides utility functions for PrimeVue Paginator.
 *
 * @param pagination - Initial pagination state
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
    const resetPage = (scroll: boolean = false): void => {
        pagination.value.page = 1;

        if (scroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Computed property for the first record index (0-indexed).
     */
    const first = (paginated?: Paginated<any>): number | undefined => {
        if (!paginated) return undefined;
        return (paginated.page - 1) * paginated.perPage;
    };

    return {
        onPageChange,
        resetPage,
        first,
    };
}
