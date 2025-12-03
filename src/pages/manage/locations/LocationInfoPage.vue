<script lang="ts" setup>
import Button from 'primevue/button';
import Tab from 'primevue/tab';
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import SubTabs from '@/components/shared/molecules/SubTabs.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
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
import { useReadProfileAuthorityMemberships } from '@/composables/data/useMembers';
import { imageToBody, type ImageBody } from '@/domain/image';
import { locationToBody, type Location, type LocationBody } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
}>();

const activeSubTab = defineModel<string>('activeSubTab', { default: 'info' });

const { data: authorities } = useReadProfileAuthorityMemberships(
    computed(() => props.authProfile.id),
);
const { mutateAsync: updateLocation, isPending: isUpdatingLocation } = useUpdateLocation();
const { mutateAsync: updateImages, isPending: isUpdatingImages } = useUpdateLocationImages();

const locationForm = ref<LocationBody | null>(null);
const imagesForm = ref<ImageBody[]>([]);

const originalFormSnapshot = ref<string>('');
const originalImagesSnapshot = ref<string>('');

const isUpdating = computed(() => {
    return isUpdatingLocation.value || isUpdatingImages.value;
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

const hasChanges = computed(() => {
    return hasLocationChanges.value || hasImagesChanges.value;
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

const breadcrumbs = computed(() => [
    { label: 'Locaties', to: { name: 'manage.locations' } },
    { label: props.location?.name ?? 'Locatie' },
]);

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

    if (hasLocationChanges.value) {
        await updateLocation({
            locationId: props.location.id,
            data: locationForm.value,
        });
    }

    if (hasImagesChanges.value) {
        const originalImages: ImageBody[] = (props.location.images || []).map((img) => {
            const body = imageToBody(img, img.index);

            return { ...body, locationId: props.location.id };
        });

        await updateImages({
            locationId: props.location.id,
            originalImages,
            currentImages: imagesForm.value,
        });
    }

    // Update snapshots after successful save
    originalFormSnapshot.value = JSON.stringify(locationForm.value);
    originalImagesSnapshot.value = JSON.stringify(imagesForm.value);
}
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <LayoutTitle :title="location.name" />

        <SubTabs class="my-10" v-model="activeSubTab" default-tab="info">
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
                <span class="tab-label">Instellingen</span>
            </Tab>
        </SubTabs>

        <Transition name="fade" mode="out-in">
            <section :key="activeSubTab">
                <!-- Information Builder -->
                <LocationInformationBuilder
                    v-if="activeSubTab === 'info' && locationForm"
                    v-model="locationForm">
                </LocationInformationBuilder>

                <!-- Images Builder -->
                <LocationImagesBuilder v-else-if="activeSubTab === 'images'" v-model="imagesForm" />

                <!-- Settings Builder -->
                <LocationSettingsBuilder
                    v-else-if="activeSubTab === 'settings' && locationForm"
                    :authorities="authorities"
                    v-model:form="locationForm">
                </LocationSettingsBuilder>
            </section>
        </Transition>

        <!-- Sticky Save Bar (teleported outside to prevent layout shift) -->
        <Teleport to="body">
            <Transition name="slide-up">
                <div v-if="hasChanges" class="save-bar">
                    <div class="save-bar__content">
                        <p class="save-bar__content-text">
                            <FontAwesomeIcon :icon="faWarning" class="mr-2" />
                            Je hebt niet-opgeslagen wijzigingen.
                        </p>
                        <div class="save-bar__content-actions">
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
                                    class="mr-2">
                                </FontAwesomeIcon>
                                <FontAwesomeIcon :icon="faSave" class="mr-2" v-else />
                                Opslaan
                            </Button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.save-bar {
    @apply fixed bottom-8 left-1/2 z-50 w-full max-w-[700px] -translate-x-1/2 px-6 py-4;
    @apply rounded-full border border-slate-800 bg-slate-900 text-slate-100;

    .save-bar__content {
        @apply flex items-center justify-between;
        @apply gap-4;
    }

    .save-bar__content-text {
        @apply flex items-center text-sm font-medium;
    }

    .save-bar__content-actions {
        @apply flex items-center gap-4;
    }
}
</style>
