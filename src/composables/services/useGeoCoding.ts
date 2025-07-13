import { mapBoxClient } from '@/config/axios';
import { mapboxEndpoints } from '@/endpoints';
import { useQuery } from '@tanstack/vue-query';
import { useDebounce } from '@vueuse/core';
import { type MaybeRef, type Ref, computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

export function useGeoCoding() {
    return {};
}

type UseGeoSearch = ReturnType<typeof useQuery<GeoJSON.GeoJsonProperties[] | undefined>>;

type UseGeoSearchOptions = {
    types?: string;
    auto_complete?: boolean;
    country?: string;
    limit?: number;
};

const defaultGeoSearchOptions: UseGeoSearchOptions = {
    auto_complete: true,
    types: 'place,locality',
    country: 'be',
    limit: 5,
};

/**
 * A composable function to perform a location search using Mapbox's geocoding API.
 *
 * @param options - Optional parameters to customize the geocoding search.
 * @returns An object containing the search input and the query result.
 */
export function useGeoSearch(search: Ref<string>, options: UseGeoSearchOptions = defaultGeoSearchOptions): UseGeoSearch {
    const { locale } = useI18n();

    const debouncedSearch = useDebounce(search, 250);
    const isEnabled = computed(() => debouncedSearch.value.length > 0);
    
    const query = useQuery({
        queryKey: ['geosearch', debouncedSearch],
        retry: false,
        enabled: isEnabled,
        queryFn: async () => {
            const q = debouncedSearch.value.trim().toLowerCase();

            const response = await mapBoxClient.get<GeoJSON.FeatureCollection>(
                mapboxEndpoints.geocoding.forward,
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

    return query;
}
