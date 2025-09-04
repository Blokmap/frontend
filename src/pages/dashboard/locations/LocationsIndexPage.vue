<script setup lang="ts">
import LocationDataList from '@/components/features/location/LocationDataList.vue';
import { useLocationsSearch } from '@/composables/data/useLocations';
import { useBreadcrumbStore } from '@/composables/store/useBreadcrumbs';
import type { Location, LocationFilter } from '@/domain/location';
import { ref } from 'vue';

const { setBreadcrumbs } = useBreadcrumbStore();

const filters = ref<LocationFilter>({
    query: '',
    perPage: 3,
    page: 1,
});

const { data: locations, isLoading } = useLocationsSearch(filters, {
    includes: ['images', 'created_by'],
});

const handleLocationClick = (location: Location) => {
    console.log('Location clicked:', location);
    // Add navigation or other action here
};

setBreadcrumbs([
    { label: 'Dashboard', to: { name: 'dashboard' } },
    { label: 'Locations', to: { name: 'dashboard.locations.index' } },
]);
</script>

<template>
    <h1 class="text-3xl font-bold">Alle Locaties</h1>

    <LocationDataList
        :locations="locations?.data || []"
        :loading="isLoading"
        empty-message="Geen locaties gevonden"
        @location-click="handleLocationClick">
    </LocationDataList>
</template>
