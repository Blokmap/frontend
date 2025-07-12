import { client, getRandomDelay } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location } from '@/types/schema/Location';
import type { Paginated } from '@/types/schema/Pagination';
import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { formatDate } from '@vueuse/core';
import { type Ref, computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';

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
    const { locale } = useI18n();

    const query = useQuery({
        queryKey: ['locations', 'search', filters, locale],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            // Add artificial delay to simulate loading state
            await getRandomDelay(250, 500);

            const [southWest, northEast] = filters?.value?.bounds || [];
            const northEastLng = northEast?.[0];
            const northEastLat = northEast?.[1];
            const southWestLng = southWest?.[0];
            const southWestLat = southWest?.[1];

            const query = filters?.value?.query || undefined;
            const page = filters?.value?.page;
            const perPage = filters?.value?.perPage;
            const language = locale.value;
            const openOnDay = filters?.value?.openOn 
                ? formatDate(filters.value.openOn, 'YYYY-MM-DD') 
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
                language
            };

            const response = await client.get(endpoints.locations.search, { params });

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
