<script lang="ts" setup>
import LocationActionMenu from '@/components/features/location/LocationActionMenu.vue';
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
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
    useReadProfileLocations,
} from '@/composables/data/useLocations';
import type { LocationState } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    ownProfile: Profile;
    isOwnProfile: boolean;
}>();

const { data: locations, isLoading } = useReadProfileLocations(computed(() => props.profile.id));

const {
    mutateAsync: deleteLocation,
    isPending: isPendingDelete,
    variables: deleteVariables,
} = useDeleteLocation();

const {
    mutateAsync: updateLocationState,
    isPending: isPendingUpdate,
    variables: updateVariables,
} = useUpdateLocationState();

/**
 * Check if a location is currently being updated.
 * @param locationId
 */
function isLocationPending(locationId: number): boolean {
    const pendingUpdate = isPendingUpdate.value && updateVariables.value?.locationId === locationId;
    const pendingDelete = isPendingDelete.value && deleteVariables.value === locationId;
    return pendingUpdate || pendingDelete;
}

/**
 * Handle changing the state of a location.
 * @param locationId The ID of the location to update.
 * @param state The new status to set.
 * @param reason Optional reason for the status change.
 */
function onSelectLocationState(locationId: number, state: LocationState, reason?: string) {
    updateLocationState({ locationId, state, reason });
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
            <template #actions>
                <PageHeaderButton label="Locatie Indienen" severity="contrast">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </DashboardDetailHeader>

        <!-- Locations List -->
        <DataList :items="locations" :loading="isLoading">
            <template #item="{ item: location }">
                <LocationDataItem :location="location">
                    <template #actions>
                        <LocationActionMenu
                            :location="location"
                            :is-pending="isLocationPending(location.id)"
                            :show-state-select="ownProfile.isAdmin"
                            @select:state="onSelectLocationState"
                            @click:delete="onDeleteLocation">
                        </LocationActionMenu>
                    </template>
                </LocationDataItem>
            </template>
            <template #empty>
                <EmptyState
                    title="Geen locaties gevonden"
                    message="Er zijn geen locaties gekoppeld aan dit profiel.">
                </EmptyState>
            </template>
        </DataList>
    </DashboardContent>
</template>
