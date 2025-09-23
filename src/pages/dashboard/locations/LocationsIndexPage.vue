<script setup lang="ts">
import Paginator from 'primevue/paginator';
import LocationDataList from '@/components/features/location/LocationDataList.vue';
import LocationStatusDropdown from '@/components/features/location/forms/LocationStatusDropdown.vue';
import SearchField from '@/components/shared/filter/SearchField.vue';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useLocationsSearch } from '@/composables/data/useLocations';
import { abbreviateCount } from '@/utils/format';
import type { Location, LocationSearchFilter } from '@/domain/location';

const router = useRouter();

const searchQuery = ref<string>('');

const filters = ref<LocationSearchFilter>({
    query: '',
    page: 1,
    perPage: 5,
});

const {
    data: locations,
    isFetching,
    isLoading,
} = useLocationsSearch(filters, {
    includes: ['images', 'createdBy'],
});

const { data: counts } = useAdminCounts();

const onPageChange = (event: { page: number }): void => {
    filters.value.page = event.page + 1;
};

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
    filters.value.page = 1;
}, 300);

const onLocationClick = (location: Location) => {
    router.push({ name: 'locations.detail', params: { locationId: location.id } });
};
</script>

<template>
    <div class="flex items-end justify-between gap-3">
        <h1 class="text-3xl font-bold">
            Alle Locaties ({{ abbreviateCount(counts?.locationCount) ?? '...' }})
        </h1>
        <SearchField
            v-model="searchQuery"
            placeholder="Zoek door alle locaties..."
            :loading="isFetching"
            @input="onSearchChange">
        </SearchField>
    </div>

    <div class="flex gap-3">
        <LocationStatusDropdown></LocationStatusDropdown>
    </div>

    <LocationDataList
        :locations="locations?.data"
        :loading="isLoading"
        @click:location="onLocationClick">
    </LocationDataList>

    <Paginator
        v-if="locations?.data?.length"
        :first="locations.perPage * (locations.page - 1)"
        :rows="locations.perPage"
        :total-records="locations.total"
        @page="onPageChange">
    </Paginator>
</template>
