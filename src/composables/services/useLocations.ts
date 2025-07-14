import { client, getRandomDelay } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location } from '@/types/schema/Location';
import type { Paginated } from '@/types/schema/Pagination';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { formatDate } from '@vueuse/core';
import { type MaybeRef, computed, toValue } from 'vue';
import { useI18n } from 'vue-i18n';

type UseLocationsSearch = ReturnType<typeof useQuery<Paginated<Location>>>;

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @returns An object containing the search results and their state.
 */
export function useLocationsSearch(filters?: MaybeRef<LocationFilter>): UseLocationsSearch {
    const { locale } = useI18n();

    const enabled = computed<boolean>(() => {
        const filtersValue = toValue(filters);
        return !filtersValue || !!filtersValue.bounds;
    });

    const query = useQuery({
        queryKey: ['locations', 'search', filters, locale],
        enabled: enabled,
        placeholderData: keepPreviousData,
        queryFn: async () => {
            // Add artificial delay to simulate loading state
            await getRandomDelay(250, 350);

            const filtersValue = toValue(filters);

            const [southWest, northEast] = filtersValue?.bounds || [];
            const northEastLng = northEast?.[0];
            const northEastLat = northEast?.[1];
            const southWestLng = southWest?.[0];
            const southWestLat = southWest?.[1];

            const query = filtersValue?.query || undefined;
            const page = filtersValue?.page;
            const perPage = filtersValue?.perPage;
            const language = locale.value;
            const openOnDay = filtersValue?.openOn
                ? formatDate(filtersValue?.openOn, 'YYYY-MM-DD')
                : null;

            const params = {
                northEastLng,
                northEastLat,
                southWestLng,
                southWestLat,
                query,
                page,
                perPage,
                openOnDay,
                language,
            };

            const response = await client.get(endpoints.locations.search, { params });

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
