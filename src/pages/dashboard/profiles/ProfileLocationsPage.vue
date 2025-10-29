<script lang="ts" setup>
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
import LocationDataList from '@/components/features/location/LocationDataList.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import {
    useDeleteLocation,
    useLocationState,
    useReadProfileLocations,
} from '@/composables/data/useLocations';
import { useToast } from '@/composables/store/useToast';
import type { LocationState } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    ownProfile: Profile;
    isOwnProfile: boolean;
}>();

const toast = useToast();

const { data: locations, refetch, isLoading } = useReadProfileLocations(props.profile.id);

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

const { mutateAsync: deleteLocation, isPending: isPendingDelete } = useDeleteLocation({
    onSuccess: async () => {
        await refetch();

        toast.add({
            severity: 'success',
            summary: 'Locatie Verwijderd',
            detail: 'De locatie is succesvol verwijderd.',
        });
    },
    onError: (error: any) => {
        const message = error.message || 'Er is iets misgegaan bij het verwijderen van de locatie.';

        toast.add({
            severity: 'error',
            summary: 'Fout bij verwijderen locatie',
            detail: message,
        });
    },
});

/**
 * Check if a location is currently being updated.
 * @param locationId
 */
function isLocationPending(locationId: number): boolean {
    return isUpdatingLocation.value && updateVariables.value?.locationId === locationId;
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
 *
 * @param locationId The ID of the location to delete.
 */
function onDeleteLocation(locationId: number) {
    deleteLocation(locationId);
}
</script>

<template>
    <DashboardContent>
        <!-- Header -->
        <DashboardDetailHeader title="Locaties">
            <template #secondary>
                <span v-if="isOwnProfile">
                    Een lijst van alle locaties die jij hebt ingediend.
                </span>
                <span v-else>
                    Een lijst van alle locaties die door {{ props.profile.firstName }} zijn
                    ingediend.
                </span>
            </template>
        </DashboardDetailHeader>

        <!-- Locations List -->
        <LocationDataList :locations="locations" :loading="isLoading">
            <template #item="{ location }">
                <LocationDataItem
                    :location="location"
                    :action-is-pending="isLocationPending(location.id)"
                    :delete-is-pending="isPendingDelete"
                    :show-status-change="ownProfile.isAdmin"
                    @change:state="onChangeLocationStatus"
                    @click:delete="onDeleteLocation">
                </LocationDataItem>
            </template>
        </LocationDataList>
    </DashboardContent>
</template>
