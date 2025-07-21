import type { LocationFilter } from '@/types/schema/Filter';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Pinia store for managing location filters.
 */
export const useLocationFilters = defineStore('locationFilters', () => {
    const flyToTrigger = ref(0);

    const filters = ref<LocationFilter>({
        query: null,
        location: null,
        isReservable: null,
        openOn: null,
        bounds: null,
        perPage: 12,
        center: null,
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

    /**
     * Request to fly to the current location filter.
     *
     * This function is used to trigger a map fly-to action based on the current location filter.
     */
    function triggerFlyTo(): void {
        flyToTrigger.value += 1;
    }

    return {
        filters,
        flyToTrigger,
        updateFilters,
        triggerFlyTo,
    };
});
