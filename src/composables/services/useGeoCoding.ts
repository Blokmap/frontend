import { mapBoxClient } from '@/config/axios';
import { mapboxEndpoints } from '@/endpoints';
import { useQuery } from '@tanstack/vue-query';
import { useDebounce } from '@vueuse/core';
import { type Ref, computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

export function useGeoCoding() {
    return {};
}

export function useGeoSearch() {
    const { locale } = useI18n();

    const search = ref('');
    const debouncedSearch = useDebounce(search, 250);

    const isEnabled = computed(() => debouncedSearch.value.length > 3);

    const query = useQuery({
        queryKey: ['geosearch', debouncedSearch],
        retry: false,
        enabled: isEnabled,
        queryFn: async () => {
            const response = await mapBoxClient.get<GeoJSON.FeatureCollection>(
                mapboxEndpoints.search.forward,
                {
                    params: {
                        access_token: import.meta.env.VITE_MAPBOX_API_KEY,
                        q: debouncedSearch.value,
                        language: locale.value,
                        auto_complete: true,
                        country: 'be',
                        limit: 5,
                    },
                },
            );
            return response.data;
        },
    });

    return {
        search,
        query,
    };
}
