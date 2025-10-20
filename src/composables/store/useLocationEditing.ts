import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { imageToRequest, type ImageRequest } from '@/domain/image';
import { locationToRequest, type Location, type LocationRequest } from '@/domain/location';

/**
 * Pinia store for managing location editing state.
 * Handles the edit forms for location information, images, and tracks changes.
 */
export const useLocationEditing = defineStore('locationEditing', () => {
    const location = ref<Location | undefined>(undefined);
    const locationForm = ref<LocationRequest | null>(null);
    const imagesForm = ref<ImageRequest[]>([]);

    const originalFormSnapshot = ref<string>('');
    const originalImagesSnapshot = ref<string>('');

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

    /**
     * Initialize the editing state with a location.
     * Maps the location data to form format and creates snapshots.
     *
     * @param {Location} newLocation - The location to edit.
     */
    function initializeLocation(newLocation: Location): void {
        location.value = newLocation;

        // Map location to form format
        const request = locationToRequest(newLocation);
        locationForm.value = request;
        originalFormSnapshot.value = JSON.stringify(request);

        // Map images to form format
        const mappedImages = (newLocation.images || []).map(imageToRequest);
        imagesForm.value = mappedImages;
        originalImagesSnapshot.value = JSON.stringify(mappedImages);
    }

    /**
     * Reset all changes to the original state.
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
     * Update the snapshots after a successful save.
     * This marks the current state as the new "original" state.
     */
    function updateSnapshots(): void {
        originalFormSnapshot.value = JSON.stringify(locationForm.value);
        originalImagesSnapshot.value = JSON.stringify(imagesForm.value);
    }

    /**
     * Clear all editing state.
     */
    function clearState(): void {
        location.value = undefined;
        locationForm.value = null;
        imagesForm.value = [];
        originalFormSnapshot.value = '';
        originalImagesSnapshot.value = '';
    }

    return {
        location,
        locationForm,
        imagesForm,
        hasLocationChanges,
        hasImagesChanges,
        hasChanges,
        initializeLocation,
        resetChanges,
        updateSnapshots,
        clearState,
    };
});
