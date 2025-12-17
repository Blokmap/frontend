import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LocationSearchFilter } from '@/domain/location';
import type { LngLatBounds, MapOptions } from '@/domain/map';

/**
 * Pinia store for managing location filters.
 */
export const useLocationFilters = defineStore('locationFilters', () => {
    const config = useLocalStorage<MapOptions & { bounds?: LngLatBounds | null }>('map', {});
    const geoLocation = ref<GeoJSON.GeoJsonProperties | null>(null);

    const filters = ref<LocationSearchFilter>({
        isReservable: null,
        openOn: null,
        bounds: config.value.bounds,
        center: null,
        perPage: 36,
        page: 1,
    });

    /**
     * Update the location filters with new values.
     *
     * @param {Partial<LocationSearchFilter>} newFilters - The new filter values to update.
     * @returns {void}
     */
    function updateFilters(newFilters: Partial<LocationSearchFilter>): void {
        Object.assign(config.value, newFilters);
        Object.assign(filters.value, newFilters);
    }

    function updateConfig(newConfig: Partial<MapOptions & { bounds?: LngLatBounds | null }>): void {
        Object.assign(config.value, newConfig);
    }

    return {
        filters,
        config,
        geoLocation,
        updateFilters,
        updateConfig,
    };
});
