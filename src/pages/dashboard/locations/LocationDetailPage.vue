<script setup lang="ts">
import Button from 'primevue/button';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import LocationImagesStep from '@/components/features/location/builder/steps/LocationImagesStep.vue';
import LocationInformationStep from '@/components/features/location/builder/steps/LocationInformationStep.vue';
import LocationSettingsStep from '@/components/features/location/builder/steps/LocationSettingsStep.vue';
import DashboardLoading from '@/components/shared/molecules/DashboardLoading.vue';
import DashboardNotFound from '@/components/shared/molecules/DashboardNotFound.vue';
import {
    faCalendar,
    faCog,
    faImages,
    faList,
    faSave,
    faSpinner,
    faUsers,
    faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useUpdateLocationImages } from '@/composables/data/useLocationImages';
import { useReadLocation, useUpdateLocation } from '@/composables/data/useLocations';
import { useToast } from '@/composables/store/useToast';
import { imageToRequest } from '@/domain/image';
import { locationToRequest } from '@/domain/location';
import type { ImageRequest } from '@/domain/image';
import type { LocationRequest } from '@/domain/location';

const props = defineProps<{
    locationId: string;
    tab?: string;
}>();

const toast = useToast();
const router = useRouter();

const activeTab = computed<string>({
    get: () => props.tab || 'info',
    set: (value: string) => {
        router.push({
            name: 'dashboard.locations.detail',
            params: {
                locationId: props.locationId,
                tab: value,
            },
        });
    },
});

const {
    data: location,
    isLoading,
    error,
} = useReadLocation(
    computed(() => +props.locationId),
    {
        includes: ['images'],
    },
);

const { mutateAsync: updateLocation, isPending: isUpdatingLocation } = useUpdateLocation({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Opgeslagen',
            detail: 'De wijzigingen zijn succesvol opgeslagen.',
        });
    },
});

const { updateImages } = useUpdateLocationImages();

const locationForm = ref<LocationRequest | null>(null);
const imagesForm = ref<ImageRequest[]>([]);

const originalFormSnapshot = ref<string>('');
const originalImagesSnapshot = ref<string>('');

const isUpdating = computed(() => isUpdatingLocation.value);

const hasLocationChanges = computed(() => {
    const currentFormSnapshot = JSON.stringify(locationForm.value);
    return currentFormSnapshot !== originalFormSnapshot.value;
});

const hasImagesChanges = computed(() => {
    const currentImagesSnapshot = JSON.stringify(imagesForm.value);
    return currentImagesSnapshot !== originalImagesSnapshot.value;
});

const hasChanges = computed(() => {
    return hasLocationChanges.value || hasImagesChanges.value;
});

watchEffect(() => {
    if (!location.value) return;

    // Map location to form format
    const request = locationToRequest(location.value);
    locationForm.value = request;
    originalFormSnapshot.value = JSON.stringify(request);

    // Map images to form format
    const mappedImages = (location.value.images || []).map(imageToRequest);
    imagesForm.value = mappedImages;
    originalImagesSnapshot.value = JSON.stringify(mappedImages);
});

/**
 * Resets the changes made to the location and images forms.
 */
function resetChanges(): void {
    if (originalFormSnapshot.value) {
        locationForm.value = JSON.parse(originalFormSnapshot.value);
    }

    if (originalImagesSnapshot.value) {
        imagesForm.value = JSON.parse(originalImagesSnapshot.value);
    }
}

/**
 * Saves the changes made to the location and images.
 */
async function saveChanges(): Promise<void> {
    if (!locationForm.value) return;

    try {
        if (hasLocationChanges.value) {
            await updateLocation({
                locationId: +props.locationId,
                data: locationForm.value,
            });
        }

        if (hasImagesChanges.value) {
            const originalImages = JSON.parse(originalImagesSnapshot.value);

            await updateImages({
                locationId: +props.locationId,
                originalImages,
                currentImages: imagesForm.value,
            });
        }

        // Update snapshots after successful save
        originalFormSnapshot.value = JSON.stringify(locationForm.value);
        originalImagesSnapshot.value = JSON.stringify(imagesForm.value);
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Fout bij opslaan',
            detail: 'Er is iets misgegaan bij het opslaan van de wijzigingen.',
        });
    }
}
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Not Found State -->
    <DashboardNotFound
        v-else-if="!location || error"
        title="Locatie Niet Gevonden"
        message="De locatie die je zoekt bestaat niet of je hebt geen toegang.">
    </DashboardNotFound>

    <!-- Content -->
    <div v-else class="relative space-y-6">
        <!-- Header -->
        <div>
            <h1 class="text-3xl font-semibold">
                {{ location.name }}
            </h1>
            <p v-if="location.excerpt?.nl" class="mt-2 text-gray-600">
                {{ location.excerpt.nl }}
            </p>
        </div>

        <!-- Tabs -->
        <Tabs v-model:value="activeTab" class="text-sm">
            <TabList>
                <Tab value="info">
                    <FontAwesomeIcon :icon="faList" class="mr-2" />
                    <span>Informatie</span>
                </Tab>
                <Tab value="reservations">
                    <FontAwesomeIcon :icon="faUsers" class="mr-2" />
                    <span>Reservaties</span>
                </Tab>
                <Tab value="openings">
                    <FontAwesomeIcon :icon="faCalendar" class="mr-2" />
                    <span>Openingstijden</span>
                </Tab>
                <Tab value="images">
                    <FontAwesomeIcon :icon="faImages" class="mr-2" />
                    <span>Afbeeldingen</span>
                </Tab>
                <Tab value="settings" class="ml-auto">
                    <FontAwesomeIcon :icon="faCog" class="mr-2" />
                    <span>Instellingen</span>
                </Tab>
            </TabList>

            <TabPanels>
                <TabPanel value="info">
                    <div class="tab-content">
                        <LocationInformationStep v-if="locationForm" v-model="locationForm" />
                    </div>
                </TabPanel>

                <TabPanel value="images">
                    <div class="tab-content">
                        <LocationImagesStep v-model="imagesForm" />
                    </div>
                </TabPanel>

                <TabPanel value="settings">
                    <div class="tab-content">
                        <LocationSettingsStep v-if="locationForm" v-model:form="locationForm" />
                    </div>
                </TabPanel>
            </TabPanels>
        </Tabs>

        <!-- Sticky Save Bar -->
        <Transition name="slide-up">
            <div v-if="hasChanges" class="save-bar">
                <div class="save-bar__content">
                    <p class="flex items-center font-medium">
                        <FontAwesomeIcon :icon="faWarning" class="mr-2" />
                        Je hebt niet-opgeslagen wijzigingen.
                    </p>
                    <div class="flex">
                        <Button text @click="resetChanges" class="text-slate-100 hover:underline">
                            Ongedaan maken
                        </Button>
                        <Button @click="saveChanges" :loading="isUpdating">
                            <FontAwesomeIcon
                                v-if="isUpdating"
                                :icon="faSpinner"
                                spin
                                class="mr-2" />
                            <FontAwesomeIcon :icon="faSave" class="mr-2" v-else />
                            Opslaan
                        </Button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.save-bar {
    @apply fixed bottom-8 left-1/2 z-50 w-[650px] max-w-full -translate-x-1/2 px-6 py-4;
    @apply rounded-full border border-slate-800 bg-slate-900 text-slate-100;

    .save-bar__content {
        @apply flex items-center justify-between;
    }
}
</style>
