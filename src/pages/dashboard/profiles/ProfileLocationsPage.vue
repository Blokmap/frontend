<script lang="ts" setup>
import Button from 'primevue/button';
import LocationDataItem from '@/components/features/location/LocationDataItem.vue';
import LocationDataList from '@/components/features/location/LocationDataList.vue';
import DashboardLoading from '@/components/shared/molecules/DashboardLoading.vue';
import DashboardNotFound from '@/components/shared/molecules/DashboardNotFound.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useLocationState } from '@/composables/data/useLocations';
import { useReadProfile, useReadProfileLocations } from '@/composables/data/useProfile';
import { useBreadcrumbStore } from '@/composables/store/useBreadcrumbs';
import { useToast } from '@/composables/store/useToast';
import type { LocationState } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
}>();

const route = useRoute();
const toast = useToast();

const breadcrumbs = useBreadcrumbStore();

const profileId = computed(() => +route.params.profileId || props.profile.id);
const isExtProfile = computed(() => profileId.value !== props.profile.id);

const {
    data: fetchedProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
} = useReadProfile(profileId, {
    enabled: isExtProfile,
});

const { data: locations, refetch, isLoading } = useReadProfileLocations(profileId);

const {
    mutateAsync: updateLocationState,
    isPending: isUpdatingLocation,
    variables: updateVariables,
} = useLocationState({
    onSuccess: () => {
        refetch();
    },
});

const currentProfile = computed(() => (!isExtProfile.value ? props.profile : fetchedProfile.value));
const isLoadingProfile = computed(() => isExtProfile.value && isProfileLoading.value);
const showNotFound = computed(() => isExtProfile.value && isProfileError.value);
const isInitialLoading = computed(() => isLoadingProfile.value || isLoading.value);

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
async function onChangeLocationStatus(locationId: number, status: LocationState) {
    await updateLocationState({ locationId, state: status });

    toast.add({
        severity: 'success',
        summary: 'Status Bijgewerkt',
        detail: 'Locatiestatus werd succesvol bijgewerkt!',
    });
}

watchEffect(() => {
    if (isExtProfile.value) {
        breadcrumbs.setBreadcrumbs([
            { label: 'Dashboard', to: { name: 'dashboard' } },
            { label: 'Gebruikers', to: { name: 'profile' } },
            {
                label: 'Locaties',
                to: {
                    name: 'dashboard.profiles.locations',
                    params: { profileId: profileId.value },
                },
            },
        ]);
    } else {
        breadcrumbs.setBreadcrumbs([
            { label: 'Dashboard', to: { name: 'dashboard' } },
            { label: 'Mijn Profiel', to: { name: 'profile' } },
            { label: 'Locaties', to: { name: 'dashboard.profiles.locations' } },
        ]);
    }
});
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isInitialLoading" />

    <!-- Not Found State -->
    <DashboardNotFound
        v-else-if="showNotFound"
        title="Profiel Niet Gevonden"
        message="Het profiel dat je zoekt bestaat niet of je hebt geen toegang." />

    <!-- Content -->
    <template v-else>
        <div class="flex items-center justify-between gap-3">
            <h1 class="text-3xl font-bold">
                <template v-if="profileId === profile.id">Mijn Locaties</template>
                <template v-else-if="currentProfile">
                    Locaties van {{ currentProfile.firstName }} {{ currentProfile.lastName }}
                </template>
                <template v-else>Locaties</template>
            </h1>

            <RouterLink v-if="profileId === profile.id" :to="{ name: 'locations.submit' }">
                <Button severity="secondary">
                    <FontAwesomeIcon :icon="faPlus" />
                    Nieuwe Locatie
                </Button>
            </RouterLink>
        </div>

        <LocationDataList :locations="locations" :loading="false">
            <template #item="{ location }">
                <LocationDataItem
                    :location="location"
                    :action-is-pending="isLocationPending(location.id)"
                    :show-status-change="true"
                    @change:state="onChangeLocationStatus">
                </LocationDataItem>
            </template>
        </LocationDataList>
    </template>
</template>
