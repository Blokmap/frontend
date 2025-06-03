import { client } from '@/config/axios';
import type { LocationFilter } from '@/types/schema/Filter';
import { SearchedLocation } from '@/types/schema/Location';
import { useQuery } from '@tanstack/vue-query';
import { type Ref, computed } from 'vue';

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @returns An object containing the search results and their state.
 */
export function useLocationsSearch(filters: Ref<LocationFilter>) {
    const filtersKey = computed(() => JSON.stringify(Object.entries(filters.value).sort()));

    const query = useQuery({
        queryKey: ['locations', 'search', filtersKey],
        queryFn: async () => {
            const response = await client.get('/locations/search', {
                params: filters.value,
            });
            return SearchedLocation.array().parse(response.data);
        },
    });

    return {
        locations: query.data,
        locationsError: query.error,
        locationsIsLoading: query.isPending,
        locationsIsSuccess: query.isSuccess,
        locationsIsError: query.isError,
    };
}
