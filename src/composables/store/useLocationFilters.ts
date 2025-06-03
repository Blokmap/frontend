import type { LocationFilter } from '@/types/schema/Filter';
import { roundLatLng } from '@/utils/geo';
import { defineStore } from 'pinia';
import { computed, shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Pinia store for managing location filters.
 */
export const useLocationFilters = defineStore('locationFilters', () => {
    const { locale } = useI18n();

    const filters = shallowRef<LocationFilter>({
        language: locale.value,
        query: null,
    });

    /**
     * Update the location filters with new values.
     *
     * @param {Partial<LocationFilter>} newFilters - The new filter values to update.
     * @returns {void}
     */
    function updateFilters(newFilters: Partial<LocationFilter>): void {
        filters.value = {
            ...filters.value,
            ...newFilters,
            northEastLat: roundLatLng(newFilters.northEastLat),
            northEastLng: roundLatLng(newFilters.northEastLng),
            southWestLat: roundLatLng(newFilters.southWestLat),
            southWestLng: roundLatLng(newFilters.southWestLng),
        };
    }

    return {
        filters,
        updateFilters,
    };
});
