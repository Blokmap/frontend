import type { LocationFilter, ReservableOption } from '@/types/schema/Filter';
import { useQueryClient } from '@tanstack/vue-query';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Pinia store for managing location filters.
 */
export const useLocationFilters = defineStore('locationFilters', () => {
    const { locale } = useI18n();
    const queryClient = useQueryClient();

    const filters = ref<LocationFilter>({
        language: locale.value,
        query: null,
        location: null,
        isReservable: null,
        openOn: null,
        bounds: null,
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
        queryClient.invalidateQueries({ queryKey: ['locations', 'search'] });
    }

    return {
        filters,
        updateFilters,
    };
});
