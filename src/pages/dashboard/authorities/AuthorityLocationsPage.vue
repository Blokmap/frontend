<script setup lang="ts">
import LocationActionMenu from '@/components/features/location/LocationActionMenu.vue';
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import DataList from '@/components/shared/molecules/datalist/DataList.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { computed } from 'vue';
import {
    useDeleteLocation,
    useUpdateLocationState,
    useReadAuthorityLocations,
} from '@/composables/data/useLocations';
import type { Authority } from '@/domain/authority';
import type { LocationState } from '@/domain/location';

const props = defineProps<{
    authority: Authority;
}>();

const { data: locations, isLoading } = useReadAuthorityLocations(
    computed(() => props.authority.id),
);

const { mutateAsync: updateLocation, isPending: isUpdatingLocation } = useUpdateLocationState();
const { mutateAsync: deleteLocation, isPending: isDeletingLocation } = useDeleteLocation();

const isPendingUpdate = computed(() => isUpdatingLocation.value || isDeletingLocation.value);

/**
 * Handle state selection for a location.
 *
 * @param locationId - ID of the location
 * @param state - New state to set
 */
function onStateSelect(locationId: number, state: LocationState) {
    updateLocation({
        locationId,
        state,
    });
}

/**
 * Handle delete click for a location.
 *
 * @param locationId - ID of the location to delete
 */
function onDeleteClick(locationId: number) {
    deleteLocation(locationId);
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader
            title="Locaties"
            secondary="Bekijk alle locaties die aan deze autoriteit zijn gekoppeld.">
        </DashboardDetailHeader>

        <!-- Locations List -->
        <DataList :items="locations" :loading="isLoading">
            <template #item="{ item }">
                <LocationDataItem :location="item">
                    <template #actions>
                        <LocationActionMenu
                            :location="item"
                            :is-pending="isPendingUpdate"
                            @select:state="onStateSelect(item.id, $event)"
                            @click:delete="onDeleteClick(item.id)">
                        </LocationActionMenu>
                    </template>
                </LocationDataItem>
            </template>
            <template #empty>
                <EmptyState
                    title="Geen locaties gevonden"
                    message="Er zijn geen locaties gekoppeld aan deze autoriteit.">
                </EmptyState>
            </template>
        </DataList>
    </DashboardContent>
</template>
