<script setup lang="ts">
import Button from 'primevue/button';
import Paginator from 'primevue/paginator';
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
import LocationDataList from '@/components/features/location/LocationDataList.vue';
import LocationStateDropdown from '@/components/features/location/forms/LocationStateSelect.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DashboardLoading from '@/components/shared/molecules/DashboardLoading.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useDeleteLocation, useLocations, useLocationState } from '@/composables/data/useLocations';
import { useToast } from '@/composables/store/useToast';
import { abbreviateCount } from '@/utils/format';
import type { LocationFilter, LocationState } from '@/domain/location';

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
} = useLocationState({
    onSuccess: async () => {
        await refetch();
        toast.add({
            severity: 'success',
            summary: 'Status Bijgewerkt',
            detail: 'Locatiestatus werd succesvol bijgewerkt!',
        });
    },
});

const {
    mutateAsync: deleteLocation,
    isPending: isDeletingLocation,
    variables: deleteVariables,
} = useDeleteLocation({
    onSuccess: async () => {
        await refetch();
        toast.add({
            severity: 'success',
            summary: 'Locatie Verwijderd',
            detail: 'De locatie werd succesvol verwijderd!',
        });
    },
});

const { data: counts } = useAdminCounts();

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
    filters.value.page = 1;
}, 300);

/**
 * Check if a location is currently being updated.
 * @param locationId
 */
function isLocationPending(locationId: number): boolean {
    return isUpdatingLocation.value && updateVariables.value?.locationId === locationId;
}

/**
 * Check if a location is currently being deleted.
 * @param locationId
 */
function isLocationDeleting(locationId: number): boolean {
    return isDeletingLocation.value && deleteVariables.value === locationId;
}

/**
 * Handle changing the page in the paginator.
 * @param event The pagination event containing the new page number.
 */
function onPageChange(event: { page: number }): void {
    filters.value.page = event.page + 1;
}

/**
 * Handle changing the status of a location.
 * @param locationId The ID of the location to update.
 * @param status The new status to set.
 */
function onChangeLocationStatus(locationId: number, status: LocationState) {
    updateLocationState({ locationId, state: status });
}

/**
 * Handle deleting a location.
 * @param locationId The ID of the location to delete.
 */
function onDeleteLocation(locationId: number) {
    deleteLocation(locationId);
}
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Content -->
    <template v-else>
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

            <RouterLink :to="{ name: 'locations.submit' }">
                <Button severity="secondary">
                    <FontAwesomeIcon :icon="faPlus" />
                    Nieuwe Locatie
                </Button>
            </RouterLink>
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

        <LocationDataList :locations="locations?.data" :loading="isLoading">
            <template #item="{ location }">
                <LocationDataItem
                    :location="location"
                    :action-is-pending="isLocationPending(location.id)"
                    :delete-is-pending="isLocationDeleting(location.id)"
                    :show-status-change="true"
                    @click:delete="onDeleteLocation(location.id)"
                    @change:state="onChangeLocationStatus">
                </LocationDataItem>
            </template>
        </LocationDataList>

        <Paginator
            v-if="locations?.data?.length"
            :first="locations.perPage * (locations.page - 1)"
            :rows="locations.perPage"
            :total-records="locations.total"
            @page="onPageChange">
        </Paginator>
    </template>
</template>
