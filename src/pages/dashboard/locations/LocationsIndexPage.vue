<script setup lang="ts">
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import LocationDataList from '@/components/features/location/LocationDataList.vue';
import LocationStateDropdown from '@/components/features/location/forms/LocationStateSelect.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useLocations, useLocationState } from '@/composables/data/useLocations';
import { useToast } from '@/composables/store/useToast';
import { abbreviateCount } from '@/utils/format';
import type { Location, LocationFilter, LocationState } from '@/domain/location';

const router = useRouter();
const toast = useToast();

const searchQuery = ref<string>('');

const filters = ref<LocationFilter>({
    query: '',
    state: null,
    page: 1,
    perPage: 5,
});

const {
    data: locations,
    refetch,
    isFetching,
    isLoading,
} = useLocations(filters, {
    includes: ['images', 'createdBy'],
});

const {
    mutateAsync: updateLocationState,
    isPending: isUpdatingLocation,
    variables: updateVariables,
} = useLocationState();

const { data: counts } = useAdminCounts();

const isLocationPending = (locationId: number): boolean => {
    return isUpdatingLocation.value && updateVariables.value?.locationId === locationId;
};

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

const onChangeLocationStatus = async (locationId: number, status: LocationState) => {
    await updateLocationState({ locationId, state: status });
    await refetch();
    toast.add({
        severity: 'success',
        summary: 'Status Bijgewerkt',
        detail: 'Locatiestatus werd succesvol bijgewerkt!',
    });
};
</script>

<template>
    <div class="flex items-center justify-between gap-3">
        <div class="space-y-2">
            <h1 class="text-3xl font-bold">
                Alle Locaties ({{ abbreviateCount(counts?.locationCount) ?? '...' }})
            </h1>

            <ResultSummary
                :current-count="locations?.data.length"
                :total-count="locations?.total"
                :truncated="locations?.truncated"
                empty-message="Geen locaties gevonden.">
            </ResultSummary>
        </div>

        <Button severity="secondary">
            <FontAwesomeIcon :icon="faPlus" />
            Nieuwe Locatie
        </Button>
    </div>

    <div class="flex gap-3">
        <SearchField
            v-model="searchQuery"
            placeholder="Zoek door alle locaties..."
            :loading="isFetching"
            @input="onSearchChange">
        </SearchField>
        <LocationStateDropdown v-model:status="filters.state" />
    </div>

    <LocationDataList
        :locations="locations?.data"
        :loading="isLoading"
        :is-location-pending="isLocationPending"
        @click:location="onLocationClick"
        @change:state="onChangeLocationStatus">
    </LocationDataList>

    <Paginator
        v-if="locations?.data?.length"
        :first="locations.perPage * (locations.page - 1)"
        :rows="locations.perPage"
        :total-records="locations.total"
        @page="onPageChange">
    </Paginator>
</template>
