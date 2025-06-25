import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location } from '@/types/schema/Location';
import type { Paginated } from '@/types/schema/Pagination';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { type Ref, computed } from 'vue';

type UseLocationsSearch = {
    locations: Ref<Paginated<Location> | undefined>;
    locationsError: Ref<Error | null>;
    locationsIsLoading: Ref<boolean>;
    locationsIsSuccess: Ref<boolean>;
    locationsIsError: Ref<boolean>;
    locationsIsFetching: Ref<boolean>;
};

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @returns An object containing the search results and their state.
 */
export function useLocationsSearch(filters?: Ref<LocationFilter>): UseLocationsSearch {
    const filtersKey = computed(() => JSON.stringify(Object.entries(filters?.value || {}).sort()));

    const query = useQuery({
        queryKey: ['locations', 'search', filtersKey],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            // Add artificial delay to simulate loading state
            await new Promise((resolve) => setTimeout(resolve, 500));

            const [southWest, northEast] = filters?.value?.bounds || [];

            const response = await client.get(endpoints.locations.search, {
                params: {
                    northEastLng: northEast?.[0],
                    northEastLat: northEast?.[1],
                    southWestLng: southWest?.[0],
                    southWestLat: southWest?.[1],
                    page: filters?.value?.page,
                    perPage: filters?.value?.perPage,
                },
            });
            return response.data;
        },
    });

    return {
        locations: query.data,
        locationsError: query.error,
        locationsIsLoading: query.isPending,
        locationsIsSuccess: query.isSuccess,
        locationsIsError: query.isError,
        locationsIsFetching: query.isFetching,
    };
}

/**
 * Composable to fetch tags for locations.
 *
 * @returns An object containing the tags and their state.
 */
export function useTags() {
    const query = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await client.get(endpoints.tags.list);
            return response.data;
        },
    });

    return {
        tags: query.data,
        tagsError: query.error,
        tagsIsLoading: query.isPending,
        tagsIsSuccess: query.isSuccess,
        tagsIsError: query.isError,
    };
}
