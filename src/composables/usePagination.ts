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
     * @param scroll - Whether to scroll to top after page change (default: true)
     */
    const onPageChange = (event: { page: number }, scroll: boolean = true): void => {
        pagination.value.page = event.page + 1;

        if (scroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Reset pagination to the first page.
     *
     * @param scroll - Whether to scroll to top after resetting page (default: true)
     */
    const resetPage = (scroll: boolean = true): void => {
        pagination.value.page = 1;

        if (scroll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    /**
     * Computed property for the first record index (0-indexed).
     *
     * @param paginated - The paginated data object
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
