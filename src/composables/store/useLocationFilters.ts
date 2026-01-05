import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DEFAULT_LOCATION_FILTER, type LocationSearchFilter } from '@/domain/location';
import { useSearchLocations } from '../data/useLocations';
import type { LngLat } from '@/domain/map';

export type ConfigCache = {
    center?: LngLat;
    zoom?: number;
};

export const useLocationFilters = defineStore('locationFilters', () => {
    const mapConfigCache = useLocalStorage<ConfigCache>('mapConfigCache', {});

    const geoLocation = ref<GeoJSON.GeoJsonProperties | null>(null);
    const filters = ref<LocationSearchFilter>(DEFAULT_LOCATION_FILTER);

    const {
        data: locations,
        isFetching,
        isLoading,
        isPending,
    } = useSearchLocations(filters, {
        enabled: computed(() => !!filters.value.bounds),
    });

    const updateConfigCache = (newCache: ConfigCache): void => {
        Object.assign(mapConfigCache.value, newCache);
    };

    const updateFilters = (newFilters: LocationSearchFilter): void => {
        Object.assign(filters.value, newFilters);
    };

    return {
        filters,
        mapConfigCache,
        geoLocation,
        updateFilters,
        updateConfigCache,
        locations,
        isFetching,
        isLoading,
        isPending,
    };
});
