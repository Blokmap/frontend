<script lang="ts" setup>
import Paginator from 'primevue/paginator';
import SearchField from '@/components/atoms/SearchField.vue';
import LocationActionMenu from '@/components/molecules/location/LocationActionMenu.vue';
import LocationsTable from '@/components/molecules/location/LocationsTable.vue';
import LocationStateSelect from '@/components/molecules/location/forms/LocationStateSelect.vue';
import { debouncedWatch } from '@vueuse/core';
import { ref } from 'vue';
import {
    useDeleteLocation,
    useReadLocations,
    useUpdateLocationState,
} from '@/composables/data/useLocations';
import { usePagination } from '@/composables/usePagination';
import { router } from '@/config/router';
import { LocationState, type Location, type LocationFilter } from '@/domain/location';
import PageContent from '../PageContent.vue';
import PageFilters from '../PageFilters.vue';
import PageTitle from '../PageTitle.vue';

const query = ref<string>('');

const filters = ref<LocationFilter>({
    page: 1,
    perPage: 12,
    query: null,
    state: null,
});

const { first, onPageChange, resetPage } = usePagination(filters);

debouncedWatch(
    query,
    (newQuery) => {
        resetPage();
        filters.value.query = newQuery;
    },
    { debounce: 300 },
);

const { data: locations, isLoading } = useReadLocations(filters, {
    includes: ['createdBy'],
});

const { mutate: updateLocationState, isPending: isPendingStateUpdate } = useUpdateLocationState();

const onStateSelect = (locationId: number, state: LocationState, reason?: string): void => {
    updateLocationState({ locationId, state, reason });
};

const { mutate: deleteLocation, isPending: isPendingDelete } = useDeleteLocation();

const onDeleteClick = (locationId: number): void => {
    deleteLocation(locationId);
};

const onLocationClick = (location: Location) => {
    router.push({
        name: 'manage.location.info',
        params: { locationId: location.id },
    });
};
</script>

<template>
    <PageContent>
        <PageTitle title="Locaties" />

        <PageFilters>
            <SearchField v-model="query" placeholder="Zoek locaties..." />
            <LocationStateSelect v-model:state="filters.state" />
        </PageFilters>

        <LocationsTable
            :locations="locations?.data"
            :loading="isLoading"
            @click:location="onLocationClick">
            <template #actions="{ location }">
                <LocationActionMenu
                    :location="location"
                    :pending-actions="{
                        'select:state': isPendingStateUpdate,
                        'click:delete': isPendingDelete,
                    }"
                    @select:state="onStateSelect"
                    @click:delete="onDeleteClick">
                </LocationActionMenu>
            </template>
        </LocationsTable>

        <Paginator
            :first="first(locations)"
            :rows="locations?.perPage"
            :total-records="locations?.total"
            @page="onPageChange">
        </Paginator>
    </PageContent>
</template>
