<script setup lang="ts">
import Button from 'primevue/button';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import TabPanel from 'primevue/tabpanel';
import TabPanels from 'primevue/tabpanels';
import Tabs from 'primevue/tabs';
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import LocationOpeningBuilder from '@/components/features/location/builder/builders/LocationOpeningBuilder.vue';
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
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
import {
    useReadLocation,
    useUpdateLocation,
    useUpdateLocationImages,
} from '@/composables/data/useLocations';
import {
    useCreateOpeningTimes,
    useDeleteOpeningTime,
    useUpdateOpeningTime,
} from '@/composables/data/useOpeningTimes';
import { useToast } from '@/composables/store/useToast';
import { imageToRequest } from '@/domain/image';
import { locationToRequest } from '@/domain/location';
import { openingToRequest, type OpeningTimeRequest } from '@/domain/openings';
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

const { mutateAsync: updateImages, isPending: isUpdatingImages } = useUpdateLocationImages({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Opgeslagen',
            detail: 'De afbeeldingen zijn succesvol bijgewerkt.',
        });
    },
});

const { mutateAsync: createOpeningTimes } = useCreateOpeningTimes({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Openingstijd toegevoegd',
            detail: 'De openingstijd is succesvol toegevoegd.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout bij toevoegen',
            detail: 'Er is iets misgegaan bij het toevoegen van de openingstijd.',
        });
    },
});

const { mutateAsync: updateOpeningTime } = useUpdateOpeningTime({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Openingstijd bijgewerkt',
            detail: 'De openingstijd is succesvol bijgewerkt.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout bij bijwerken',
            detail: 'Er is iets misgegaan bij het bijwerken van de openingstijd.',
        });
    },
});

const { mutateAsync: deleteOpeningTime } = useDeleteOpeningTime({
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Openingstijd verwijderd',
            detail: 'De openingstijd is succesvol verwijderd.',
        });
    },
    onError: () => {
        toast.add({
            severity: 'error',
            summary: 'Fout bij verwijderen',
            detail: 'Er is iets misgegaan bij het verwijderen van de openingstijd.',
        });
    },
});

const locationForm = ref<LocationRequest | null>(null);
const imagesForm = ref<ImageRequest[]>([]);
const openingsForm = ref<OpeningTimeRequest[]>([]);

const originalFormSnapshot = ref<string>('');
const originalImagesSnapshot = ref<string>('');

const isUpdating = computed(() => isUpdatingLocation.value || isUpdatingImages.value);

const hasLocationChanges = computed(() => {
    console.log(locationForm.value);
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

    // Map openings to form format
    const mappedOpenings = (location.value.openingTimes || []).map(openingToRequest);
    openingsForm.value = mappedOpenings;
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

/**
 * Handles creation of a new opening time
 */
async function onCreateOpeningTime(openingTime: OpeningTimeRequest): Promise<void> {
    try {
        await createOpeningTimes({
            locationId: +props.locationId,
            openings: [openingTime],
        });
    } catch {
        // Error is ond by onError callback
    }
}

/**
 * Handles updating an existing opening time
 */
async function onUpdateOpeningTime(
    openingTimeId: number,
    openingTime: OpeningTimeRequest,
    sequence?: boolean,
): Promise<void> {
    updateOpeningTime({
        locationId: +props.locationId,
        openingTimeId,
        opening: openingTime,
        sequence,
    });
}

/**
 * Handles deletion of an opening time
 */
async function onDeleteOpeningTime(openingTimeId: number, sequence?: boolean): Promise<void> {
    deleteOpeningTime({
        locationId: +props.locationId,
        openingTimeId,
        sequence,
    });
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
                        <LocationInformationBuilder v-if="locationForm" v-model="locationForm" />
                    </div>
                </TabPanel>

                <TabPanel value="reservations">
                    <div class="tab-content">
                        <!-- TODO: Add reservations view -->
                    </div>
                </TabPanel>

                <TabPanel value="openings">
                    <div class="tab-content">
                        <LocationOpeningBuilder
                            :opening-times="openingsForm"
                            @create="onCreateOpeningTime"
                            @update="onUpdateOpeningTime"
                            @delete="onDeleteOpeningTime">
                        </LocationOpeningBuilder>
                    </div>
                </TabPanel>

                <TabPanel value="images">
                    <div class="tab-content">
                        <LocationImagesBuilder v-model="imagesForm" />
                    </div>
                </TabPanel>

                <TabPanel value="settings">
                    <div class="tab-content">
                        <LocationSettingsBuilder v-if="locationForm" v-model:form="locationForm" />
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
