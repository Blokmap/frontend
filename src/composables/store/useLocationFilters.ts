import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useSearchLocations } from '../data/useLocations';
import type { LocationSearchFilter } from '@/domain/location';

export const useLocationFilters = defineStore('locationFilters', () => {
    const geoLocation = ref<GeoJSON.GeoJsonProperties | null>(null);

    const filters = ref<LocationSearchFilter>({
        reservable: null,
        openOnTime: null,
        openOnDay: null,
        bounds: null,
        perPage: 36,
        page: 1,
    });

    const { data: locations, isFetching } = useSearchLocations(filters, {
        enabled: computed(() => !!filters.value.bounds),
    });

    const updateFilters = (newFilters: Partial<LocationSearchFilter>): void => {
        Object.assign(filters.value, newFilters);
    };

    return {
        filters,
        geoLocation,
        updateFilters,
        locations,
        isFetching,
    };
});
