import { client, getRandomDelay } from '@/config/axios';
import { endpoints } from '@/endpoints';
import { getLocationById, searchLocations } from '@/services/location';
import type { CompQuery, CompQueryOptions } from '@/types/contract/Composable';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location } from '@/types/schema/Location';
import type { Paginated } from '@/types/schema/Pagination';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { type MaybeRef, toValue, watch } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @param options - Additional options for the query, such as initial data or query configuration.
 * @returns An object containing the search results and their state.
 */
export function useLocationsSearch(
    filters?: MaybeRef<LocationFilter>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Location>> {
    const { locale } = useI18n();

    const query = useQuery({
        ...options,
        queryKey: ['locations', 'search', filters, locale],
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const params = toValue(filters);
            await getRandomDelay(100, 250); // network delay to avoid flickering
            return await searchLocations(params, locale.value);
        },
    });

    return query;
}

/**
 * Composable to fetch a single location by its ID.
 *
 * @param id - The ID of the location to fetch.
 * @returns An object containing the location and its state.
 */
export function useLocation(id: MaybeRef<string>): CompQuery<Location> {
    const query = useQuery({
        queryKey: ['location', id],
        queryFn: () => getLocationById(toValue(id)),
    });

    return query;
}

/**
 * Composable to fetch tags for locations.
 *
 * @returns An object containing the tags and their state.
 */
export function useTags(): CompQuery<string[]> {
    const query = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await client.get(endpoints.tags.list);
            return response.data;
        },
    });

    return query;
}
