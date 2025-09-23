import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { LocationSearchFilter } from '@/domain/location';

/**
 * Pinia store for managing location filters.
 */
export const useLocationFilters = defineStore('locationFilters', () => {
    const geoLocation = ref<GeoJSON.GeoJsonProperties | null>(null);

    const filters = ref<LocationSearchFilter>({
        query: null,
        isReservable: null,
        openOn: null,
        bounds: null,
        center: null,
        perPage: 12,
    });

    /**
     * Update the location filters with new values.
     *
     * @param {Partial<LocationSearchFilter>} newFilters - The new filter values to update.
     * @returns {void}
     */
    function updateFilters(newFilters: Partial<LocationSearchFilter>): void {
        Object.assign(filters.value, newFilters);
    }

    return {
        filters,
        geoLocation,
        updateFilters,
    };
});
