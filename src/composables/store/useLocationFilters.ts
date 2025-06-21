import type { LocationFilter, ReservableOption } from '@/types/schema/Filter';
import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Pinia store for managing location filters.
 */
export const useLocationFilters = defineStore('locationFilters', () => {
    const { locale } = useI18n();

    const reservableOptions: ReservableOption[] = [
        {
            value: true,
            label: 'Reserveerbaar',
        },
        {
            value: false,
            label: 'Niet reserveerbaar',
        },
        {
            value: null,
            label: 'Alle',
        },
    ];

    const filters = shallowRef<LocationFilter>({
        language: locale.value,
        query: null,
        perPage: 9,
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
        };
    }

    return {
        reservableOptions,
        filters,
        updateFilters,
    };
});
