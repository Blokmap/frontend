<script lang="ts" setup>
import LocationActionMenu from '@/components/features/location/LocationActionMenu.vue';
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import DataList from '@/components/shared/molecules/datalist/DataList.vue';
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import PageHeaderButton from '@/layouts/manage/PageHeaderButton.vue';
import DashboardDetailHeader from '@/layouts/manage/details/DashboardDetailHeader.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useDeleteLocation, useUpdateLocationState } from '@/composables/data/useLocations';
import { useReadProfileLocationMemberships } from '@/composables/data/useMembers';
import type { LocationState } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    ownProfile: Profile;
    isOwnProfile: boolean;
}>();

const { data: memberships, isLoading } = useReadProfileLocationMemberships(
    computed(() => props.profile.id),
);

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
                <RouterLink :to="{ name: 'locations.submit' }" v-if="isOwnProfile">
                    <PageHeaderButton label="Locatie Indienen" severity="contrast">
                        <FontAwesomeIcon :icon="faPlus" />
                    </PageHeaderButton>
                </RouterLink>
            </template>
        </DashboardDetailHeader>

        <!-- Locations List -->
        <DataList :items="memberships" :loading="isLoading">
            <template #item="{ item: membership }">
                <LocationDataItem :location="membership.location">
                    <template #actions>
                        <LocationActionMenu
                            :location="membership.location"
                            :show-state-select="ownProfile.isAdmin"
                            :is-pending="isLocationPending(membership.location.id)"
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
