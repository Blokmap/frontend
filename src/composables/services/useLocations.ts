import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location } from '@/types/schema/Location';
import type { Paginated } from '@/types/schema/Pagination';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { type MaybeRef, computed, toValue } from 'vue';

type UseLocationsSearch = ReturnType<typeof useQuery<Paginated<Location>>>;

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @returns An object containing the search results and their state.
 */
export function useLocationsSearch(filters?: MaybeRef<LocationFilter>): UseLocationsSearch {
    const filtersKey = computed(() => JSON.stringify(Object.entries(filters || {}).sort()));

    const query = useQuery({
        queryKey: ['locations', 'search', filtersKey],
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
        queryFn: async () => {
            // Add artificial delay to simulate loading state
            await new Promise((resolve) => setTimeout(resolve, 500));

            const filtersValue  = toValue(filters);
            const [southWest, northEast] = filtersValue?.bounds || [];

            const response = await client.get(endpoints.locations.search, {
                params: {
                    northEastLng: northEast?.[0],
                    northEastLat: northEast?.[1],
                    southWestLng: southWest?.[0],
                    southWestLat: southWest?.[1],
                    page: filtersValue?.page,
                    perPage: filtersValue?.perPage,
                },
            });

            return response.data;
        },
    });

    return query;
}

type UseLocation = ReturnType<typeof useQuery<Location>>;

/**
 * Composable to fetch a single location by its ID.
 *
 * @param id - The ID of the location to fetch.
 * @returns An object containing the location and its state.
 */
export function useLocation(id: MaybeRef<string>): UseLocation {
    const query = useQuery({
        queryKey: ['location', id],
        queryFn: async (): Promise<Location> => {
            const response = await client.get(
                endpoints.locations.read.replace('{id}', toValue(id)),
            );

            return response.data;
        },
    });

    return query;
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
