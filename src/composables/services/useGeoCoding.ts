import { mapBoxClient } from '@/config/axios';
import { mapboxEndpoints } from '@/endpoints';
import { useQuery } from '@tanstack/vue-query';
import { useDebounce } from '@vueuse/core';
import { type Ref, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

export function useGeoCoding() {
    return {};
}

type UseGeoSearch = {
    search: Ref<string>;
    searchResults: Ref<GeoJSON.GeoJsonProperties[] | undefined>;
    searchIsLoading: Ref<boolean>;
};

type UseGeoSearchOptions = {
    types?: string;
    auto_complete?: boolean;
    country?: string;
    limit?: number;
};

const geoSearchOptions: UseGeoSearchOptions = {
    auto_complete: true,
    types: 'city,street',
    country: 'be',
    limit: 5,
};

/**
 * A composable function to perform a location search using Mapbox's geocoding API.
 *
 * @param options - Optional parameters to customize the geocoding search.
 * @returns An object containing the search input and the query result.
 */
export function useGeoSearch(options: UseGeoSearchOptions = geoSearchOptions): UseGeoSearch {
    const { locale } = useI18n();

    const search = ref('');
    const debouncedSearch = useDebounce(search, 250);
    const isEnabled = computed(() => debouncedSearch.value.length > 2);

    const { data: searchResults, isLoading: searchIsLoading } = useQuery({
        queryKey: ['geosearch', debouncedSearch],
        retry: false,
        enabled: isEnabled,
        queryFn: async () => {
            const q = debouncedSearch.value.trim().toLowerCase();

            const response = await mapBoxClient.get<GeoJSON.FeatureCollection>(
                mapboxEndpoints.search.forward,
                {
                    params: {
                        q,
                        access_token: MAPBOX_ACCESS_TOKEN,
                        language: locale.value,
                        ...options,
                    },
                },
            );

            const result = response.data.features.reduce(
                (acc: GeoJSON.GeoJsonProperties[], feature: GeoJSON.Feature) => {
                    const props = feature.properties;

                    if (!acc.some((f) => f?.name === props?.name)) {
                        acc.push(props);
                    }

                    return acc;
                },
                [],
            );

            return result;
        },
    });

    return {
        search,
        searchResults,
        searchIsLoading,
    };
}
