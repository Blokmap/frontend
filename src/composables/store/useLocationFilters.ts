import type { LocationFilter } from '@/types/schema/Filter';
import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Pinia store for managing location filters.
 */
export const useLocationFilters = defineStore('locationFilters', () => {
    const geoLocation = ref<GeoJSON.GeoJsonProperties | null>(null);

    const filters = ref<LocationFilter>({
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
     * @param {Partial<LocationFilter>} newFilters - The new filter values to update.
     * @returns {void}
     */
    function updateFilters(newFilters: Partial<LocationFilter>): void {
        Object.assign(filters.value, newFilters);
    }

    return {
        filters,
        geoLocation,
        updateFilters,
    };
});
