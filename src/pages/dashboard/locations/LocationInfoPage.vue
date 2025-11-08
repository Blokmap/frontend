<script setup lang="ts">
import Button from 'primevue/button';
import Tab from 'primevue/tab';
import TabList from 'primevue/tablist';
import Tabs from 'primevue/tabs';
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardDetailHeader from '@/layouts/dashboard/details/DashboardDetailHeader.vue';
import {
    faCog,
    faImages,
    faInfoCircle,
    faSave,
    faSpinner,
    faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watchEffect } from 'vue';
import { useUpdateLocation, useUpdateLocationImages } from '@/composables/data/useLocations';
import { useToast } from '@/composables/store/useToast';
import { imageToBody, type ImageBody } from '@/domain/image';
import { locationToBody, type Location, type LocationBody } from '@/domain/location';

const props = defineProps<{
    location: Location;
}>();

const toast = useToast();

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

const locationForm = ref<LocationBody | null>(null);
const imagesForm = ref<ImageBody[]>([]);

const originalFormSnapshot = ref<string>('');
const originalImagesSnapshot = ref<string>('');

// Sub-tab navigation state
const activeSubTab = ref<'info' | 'images' | 'settings'>('info');

const isUpdating = computed(() => isUpdatingLocation.value || isUpdatingImages.value);

const hasChanges = computed(() => {
    return hasLocationChanges.value || hasImagesChanges.value;
});

const hasLocationChanges = computed(() => {
    if (!originalFormSnapshot.value) return false;
    const currentFormSnapshot = JSON.stringify(locationForm.value);
    return currentFormSnapshot !== originalFormSnapshot.value;
});

const hasImagesChanges = computed(() => {
    if (!originalImagesSnapshot.value) return false;
    const currentImagesSnapshot = JSON.stringify(imagesForm.value);
    return currentImagesSnapshot !== originalImagesSnapshot.value;
});

// Initialize forms when location prop changes
watchEffect(() => {
    if (props.location) {
        // Map location to form format
        const request = locationToBody(props.location);
        locationForm.value = request;
        originalFormSnapshot.value = JSON.stringify(request);

        // Map images to form format
        const mappedImages = (props.location.images || []).map(imageToBody);
        imagesForm.value = mappedImages;
        originalImagesSnapshot.value = JSON.stringify(mappedImages);
    }
});

/**
 * Resets all changes to the original state.
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
                locationId: props.location.id,
                data: locationForm.value,
            });
        }

        if (hasImagesChanges.value) {
            const originalImages = JSON.parse(
                JSON.stringify(
                    (props.location.images || []).map((img) => ({
                        ...img,
                        locationId: props.location.id,
                    })),
                ),
            );

            await updateImages({
                locationId: props.location.id,
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
    <DashboardContent>
        <!-- Detail Header -->
        <DashboardDetailHeader
            title="Locatie-Institutieen"
            secondary="Bekijk en beheer de instellingen van deze locatie">
        </DashboardDetailHeader>

        <!-- Sub-Tab Navigation -->
        <div class="tabs-wrapper">
            <Tabs v-model:value="activeSubTab" class="text-sm">
                <TabList>
                    <Tab value="info">
                        <FontAwesomeIcon :icon="faInfoCircle" class="tab-icon" />
                        <span class="tab-label">Basisinformatie</span>
                    </Tab>
                    <Tab value="images">
                        <FontAwesomeIcon :icon="faImages" class="tab-icon" />
                        <span class="tab-label">Afbeeldingen</span>
                    </Tab>
                    <Tab value="settings">
                        <FontAwesomeIcon :icon="faCog" class="tab-icon" />
                        <span class="tab-label">Institutieen</span>
                    </Tab>
                </TabList>
            </Tabs>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
            <!-- Information Builder -->
            <LocationInformationBuilder
                v-if="activeSubTab === 'info' && locationForm"
                v-model="locationForm">
            </LocationInformationBuilder>

            <!-- Images Builder -->
            <LocationImagesBuilder v-if="activeSubTab === 'images'" v-model="imagesForm" />

            <!-- Settings Builder -->
            <LocationSettingsBuilder
                v-if="activeSubTab === 'settings' && locationForm"
                v-model:form="locationForm">
            </LocationSettingsBuilder>
        </div>

        <!-- Sticky Save Bar (teleported outside to prevent layout shift) -->
        <Teleport to="body">
            <Transition name="slide-up">
                <div v-if="hasChanges" class="save-bar">
                    <div class="flex items-center justify-between">
                        <p class="flex items-center font-medium">
                            <FontAwesomeIcon :icon="faWarning" class="mr-2" />
                            Je hebt niet-opgeslagen wijzigingen.
                        </p>
                        <div class="flex">
                            <Button
                                text
                                @click="resetChanges"
                                class="text-slate-100 hover:underline">
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
        </Teleport>
    </DashboardContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.tabs-wrapper {
    @apply -mx-3 overflow-x-auto px-3;
    @apply md:mx-0 md:overflow-visible md:px-0;
}

.tab-icon {
    @apply mr-0 md:mr-2;
}

.tab-label {
    @apply hidden md:inline;
}

.tab-content {
    @apply mt-6;
}

.save-bar {
    @apply fixed bottom-8 left-1/2 z-50 w-full max-w-[700px] -translate-x-1/2 px-6 py-4;
    @apply rounded-full border border-slate-800 bg-slate-900 text-slate-100;
}
</style>
