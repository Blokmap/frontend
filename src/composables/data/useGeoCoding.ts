import { useMutation, useQuery } from '@tanstack/vue-query';
import { type MaybeRef, toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapBoxClient } from '@/config/axios';
import { mapboxEndpoints } from '@/config/endpoints';
import { geocodeAddress } from '@/domain/map';
import type { LngLat } from '@/domain/map';
import type { CompMutation, CompQuery, CompQueryOptions } from '@/types/Composable';
import type { AxiosError } from 'axios';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

type GeoSearchFilter = {
    search: string;
    types?: string;
    auto_complete?: boolean;
    country?: string;
    limit?: number;
};

const defaultGeoSearchOptions: Partial<GeoSearchFilter> = {
    auto_complete: true,
    types: 'place,locality',
    country: 'be',
    limit: 5,
};

/**
 * A composable function to perform a location search using Mapbox's geocoding API.
 *
 * @param filters - MaybeRef filters containing search query and mapbox options
 * @param options - CompQueryOptions for query configuration (enabled, etc.)
 * @returns An object containing the search results and their state.
 */
export function useGeoSearch(
    filters?: MaybeRef<GeoSearchFilter>,
    options: CompQueryOptions = {},
): CompQuery<GeoJSON.GeoJsonProperties[]> {
    const { locale } = useI18n();

    const query = useQuery<GeoJSON.GeoJsonProperties[], AxiosError>({
        ...options,
        queryKey: ['geosearch', filters, locale],
        retry: false,
        queryFn: async () => {
            const params = toValue(filters);
            const searchQuery = params?.search?.trim().toLowerCase();

            if (!searchQuery) {
                return [];
            }

            const requestParams = {
                q: searchQuery,
                access_token: MAPBOX_ACCESS_TOKEN,
                language: locale.value,
                ...defaultGeoSearchOptions,
                ...params,
            };

            const response = await mapBoxClient.get<GeoJSON.FeatureCollection>(
                mapboxEndpoints.geocoding.forward,
                { params: requestParams },
            );

            // Filter out duplicate names in the results
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

/**
 * A composable function to perform forward geocoding using Mapbox's geocoding API.
 * Returns coordinates for a given address string.
 */
export function useForwardGeoSearch(): CompMutation<string, LngLat> {
    const mutation = useMutation({
        mutationFn: geocodeAddress,
    });

    return mutation;
}
