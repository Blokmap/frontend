import { client, getRandomDelay } from '@/config/axios';
import { endpoints } from '@/endpoints';
import { searchLocations } from '@/services/location';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location } from '@/types/schema/Location';
import type { Paginated } from '@/types/schema/Pagination';
import { type QueryOptions, keepPreviousData, useQuery } from '@tanstack/vue-query';
import { type MaybeRef, toValue } from 'vue';
import { useI18n } from 'vue-i18n';

type UseLocationsSearch = ReturnType<typeof useQuery<Paginated<Location>>>;

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @param options - Additional options for the query, such as initial data or query configuration.
 * @returns An object containing the search results and their state.
 */
export function useLocationsSearch(
    filters?: MaybeRef<LocationFilter>,
    options = {},
): UseLocationsSearch {
    const { locale } = useI18n();

    const query = useQuery({
        ...options,
        queryKey: ['locations', 'search', locale],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const params = toValue(filters);
            await getRandomDelay(250, 350);
            const locations = await searchLocations(params, locale.value);
            return locations;
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
