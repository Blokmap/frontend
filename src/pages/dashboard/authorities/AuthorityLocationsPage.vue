<script setup lang="ts">
import LocationActionMenu from '@/components/features/location/LocationActionMenu.vue';
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import DataList from '@/components/shared/molecules/datalist/DataList.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import PageHeaderButton from '@/layouts/dashboard/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import {
    useDeleteLocation,
    useUpdateLocationState,
    useReadAuthorityLocations,
} from '@/composables/data/useLocations';
import type { Authority } from '@/domain/authority';
import type { LocationState } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authority: Authority;
    profile: Profile;
}>();

const { data: locations, isLoading } = useReadAuthorityLocations(
    computed(() => props.authority.id),
);

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

/**
 * Check if a location is currently being updated.
 * @param locationId
 */
function isLocationPending(locationId: number): boolean {
    const pendingUpdate =
        isUpdatingLocation.value && updateVariables.value?.locationId === locationId;
    const pendingDelete = isDeletingLocation.value && deleteVariables.value === locationId;
    return pendingUpdate || pendingDelete;
}
/**
 * Handle state selection for a location.
 *
 * @param locationId - ID of the location
 * @param state - New state to set
 * @param reason - Optional reason for the state change
 */
function onStateSelect(locationId: number, state: LocationState, reason?: string) {
    updateLocationState({
        locationId,
        state,
        reason,
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
            <template #actions>
                <RouterLink
                    :to="{
                        name: 'locations.submit',
                        query: { authorityId: authority.id },
                    }"
                    class="btn btn-secondary">
                    <PageHeaderButton severity="contrast" label="Locatie Indienen">
                        <FontAwesomeIcon :icon="faPlus" />
                    </PageHeaderButton>
                </RouterLink>
            </template>
        </DashboardDetailHeader>

        <!-- Locations List -->
        <DataList :items="locations" :loading="isLoading">
            <template #item="{ item }">
                <LocationDataItem :location="item">
                    <template #actions>
                        <LocationActionMenu
                            :location="item"
                            :is-pending="isLocationPending(item.id)"
                            :show-state-select="profile.isAdmin"
                            @select:state="onStateSelect"
                            @click:delete="onDeleteClick">
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
