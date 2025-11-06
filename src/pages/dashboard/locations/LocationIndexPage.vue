<script setup lang="ts">
import Paginator from 'primevue/paginator';
import LocationActionMenu from '@/components/features/location/LocationActionMenu.vue';
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
import LocationStateDropdown from '@/components/features/location/forms/LocationStateSelect.vue';
import ResultSummary from '@/components/shared/atoms/ResultSummary.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import DataList from '@/components/shared/molecules/datalist/DataList.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAdminCounts } from '@/composables/data/useAdmin';
import {
    useDeleteLocation,
    useReadLocations,
    useUpdateLocationState,
} from '@/composables/data/useLocations';
import { usePagination } from '@/composables/data/usePagination';
import { abbreviateCount } from '@/utils/formatUtils';
import type { LocationFilter, LocationState } from '@/domain/location';
import type { Profile } from '@/domain/profile';

defineProps<{ profile: Profile }>();

const { t } = useI18n();

const searchQuery = ref<string>('');

const filters = ref<LocationFilter>({
    query: '',
    state: null,
    page: 1,
    perPage: 5,
});

const {
    data: locations,
    isFetching,
    isLoading,
} = useReadLocations(filters, {
    includes: ['createdBy'],
});

const {
    mutateAsync: updateLocationState,
    isPending: isUpdatingLocation,
    variables: updateVariables,
} = useUpdateLocationState();

const {
    mutateAsync: deleteLocation,
    isPending: isDeletingLocation,
    variables: deleteVariables,
} = useDeleteLocation();

const { data: counts } = useAdminCounts();
const { onPageChange, resetPage, first } = usePagination(filters);

const pageTitle = computed(() =>
    t('pages.dashboard.locations.index.title', [
        abbreviateCount(counts.value?.locationCount) ?? '...',
    ]),
);

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
    resetPage();
}, 300);

/**
 * Check if a location is currently being updated.
 * @param locationId
 */
function isLocationPending(locationId: number): boolean {
    const isUpdating = isUpdatingLocation.value && updateVariables.value?.locationId === locationId;
    const isDeleting = isDeletingLocation.value && deleteVariables.value === locationId;

    return isUpdating || isDeleting;
}

/**
 * Handle changing the status of a location.
 * @param locationId The ID of the location to update.
 * @param status The new status to set.
 * @param reason Optional reason for status change.
 */
function onUpdateLocationState(locationId: number, status: LocationState, reason?: string) {
    updateLocationState({ locationId, state: status, reason });
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
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <template v-else>
            <DashboardPageHeader :title="pageTitle">
                <template #actions>
                    <RouterLink :to="{ name: 'locations.submit' }">
                        <PageHeaderButton
                            severity="secondary"
                            :label="$t('pages.dashboard.locations.index.new')">
                            <FontAwesomeIcon :icon="faPlus" />
                        </PageHeaderButton>
                    </RouterLink>
                </template>
                <template #metadata>
                    <ResultSummary
                        :current-count="locations?.data.length"
                        :total-count="locations?.total"
                        :truncated="locations?.truncated"
                        :empty-message="$t('pages.dashboard.locations.index.empty')">
                    </ResultSummary>
                </template>
                <template #filters>
                    <div class="flex flex-col gap-3 sm:flex-row">
                        <SearchField
                            v-model="searchQuery"
                            :placeholder="$t('pages.dashboard.locations.index.search')"
                            :loading="isFetching"
                            @input="onSearchChange">
                        </SearchField>
                        <LocationStateDropdown v-model:status="filters.state" />
                    </div>
                </template>
            </DashboardPageHeader>

            <DataList :items="locations?.data" :loading="isLoading">
                <template #item="{ item: location }">
                    <LocationDataItem :location="location" :is-pending="isLocationPending">
                        <template #actions>
                            <LocationActionMenu
                                :location="location"
                                @click:delete="onDeleteLocation"
                                @select:state="onUpdateLocationState">
                            </LocationActionMenu>
                        </template>
                    </LocationDataItem>
                </template>
            </DataList>

            <Paginator
                v-if="locations?.data?.length"
                :first="first"
                :rows="locations.perPage"
                :total-records="locations.total"
                @page="onPageChange">
            </Paginator>
        </template>
    </DashboardContent>
</template>
