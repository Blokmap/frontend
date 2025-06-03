<script lang="ts" setup>
import BlokMap from '@/components/features/blokmap/BlokMap.vue';
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import { useLocationsSearch } from '@/composables/services/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location } from '@/types/schema/Location';
import { debouncedRef } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { onMounted, ref, useTemplateRef } from 'vue';

const { updateFilters } = useLocationFilters();
const { filters } = storeToRefs(useLocationFilters());
const debouncedFilters = debouncedRef<LocationFilter>(filters, 500);
const { locations, locationsIsLoading } = useLocationsSearch(debouncedFilters);

const blokmap = useTemplateRef('blokmap');
const selected = ref<Location | null>(null);

/**
 * Updates the location filters based on the current map bounds.
 */
function updateLocationFilters(): void {
    if (blokmap.value?.map) {
        const bounds = blokmap.value.map.getBounds();
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        updateFilters({
            northEastLat: northEast.lat,
            northEastLng: northEast.lng,
            southWestLat: southWest.lat,
            southWestLng: southWest.lng,
        });
    }
}

onMounted(() => {
    blokmap.value?.map?.on('moveend', updateLocationFilters);
});
</script>

<template>
    <h1 class="text-center text-4xl font-extrabold my-16">
        Find your perfect <span class="text-secondary">study spot</span> in Flanders
    </h1>
    <div class="flex flex-col gap-8 w-full xl:w-2/3 mx-auto mb-16">
        <LocationSearch />
        <div class="max-h-full h-[600px]">
            <BlokMap
                :locations="locations"
                :is-loading="locationsIsLoading"
                v-model:location="selected"
                ref="blokmap"
                rounded>
            </BlokMap>
        </div>
    </div>
    <h2 class="text-2xl font-bold mb-8">Featured Locations</h2>
</template>
