<script lang="ts" setup>
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import LocationDataList from '@/components/features/location/LocationDataList.vue';
import NotFound from '@/components/shared/atoms/NotFound.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLocationState } from '@/composables/data/useLocations';
import { useProfile, useProfileLocations } from '@/composables/data/useProfile';
import { useToast } from '@/composables/store/useToast';
import type { Location, LocationState } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
}>();

const route = useRoute();
const router = useRouter();
const toast = useToast();

const profileId = computed(() => +route.params.profileId || props.profile.id);
const shouldFetchProfile = computed(() => profileId.value !== props.profile.id);

const {
    data: fetchedProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
} = useProfile(profileId, {
    enabled: shouldFetchProfile,
});

const { data: locations, refetch, isLoading } = useProfileLocations(profileId);

const {
    mutateAsync: updateLocationState,
    isPending: isUpdatingLocation,
    variables: updateVariables,
} = useLocationState({
    onSuccess: () => {
        refetch();
    },
});

const currentProfile = computed(() => (!shouldFetchProfile ? props.profile : fetchedProfile.value));
const isLoadingProfile = computed(() => shouldFetchProfile.value && isProfileLoading.value);
const showNotFound = computed(() => shouldFetchProfile.value && isProfileError.value);

/**
 * Check if a location is currently being updated.
 * @param locationId
 */
function isLocationPending(locationId: number): boolean {
    return isUpdatingLocation.value && updateVariables.value?.locationId === locationId;
}

/**
 * Handle clicking on a location to view its details.
 * @param location The location that was clicked.
 */
function onLocationClick(location: Location): void {
    router.push({ name: 'locations.detail', params: { locationId: location.id } });
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
</script>

<template>
    <!-- Loading State -->
    <div v-if="isLoadingProfile" class="flex items-center justify-center py-12">
        <ProgressSpinner />
    </div>

    <!-- Not Found State -->
    <NotFound
        v-else-if="showNotFound"
        title="Profiel Niet Gevonden"
        message="Het profiel dat je zoekt bestaat niet of je hebt geen toegang.">
    </NotFound>

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

        <LocationDataList
            :locations="locations"
            :loading="isLoading"
            :is-location-pending="isLocationPending"
            @click:location="onLocationClick"
            @change:state="onChangeLocationStatus">
        </LocationDataList>
    </template>
</template>
