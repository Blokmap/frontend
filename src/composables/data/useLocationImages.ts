import { useQueryClient } from '@tanstack/vue-query';
import { createLocationImage, deleteLocationImage, reorderLocationImages } from '@/domain/location';
import { LOCATION_QUERY_KEYS } from './useLocations';
import type { ImageReorderRequest, ImageRequest } from '@/domain/image';

export type UpdateLocationImagesParams = {
    locationId: number;
    originalImages: ImageRequest[];
    currentImages: ImageRequest[];
};

/**
 * Composable to handle bulk image operations:
 * 1. Delete removed images
 * 2. Create new images
 * 3. Reorder all images based on the form order
 *
 * @returns Function to update images for a location
 */
export function useUpdateLocationImages() {
    const queryClient = useQueryClient();

    const updateImages = async ({
        locationId,
        originalImages,
        currentImages,
    }: UpdateLocationImagesParams): Promise<void> => {
        // Step 1: Delete removed images (those with id in original but not in current)
        const currentImageIds = new Set(
            currentImages.filter((img) => !!img.id).map((img) => img.id),
        );

        const imagesToDelete = originalImages
            .filter((img) => img.id !== undefined && !currentImageIds.has(img.id))
            .map((img) => img.id!);

        await Promise.all(
            imagesToDelete.map((imageId) => {
                deleteLocationImage(locationId, imageId);
            }),
        );

        // Step 2: Create new images in parallel (those without id)
        // New images are created with the correct index already from ImageRequest
        const newImages = currentImages.filter((img) => !img.id && img.file);

        await Promise.all(
            newImages.map(async (img) => {
                const newImage = await createLocationImage(locationId, img);
                img.id = newImage.id;
            }),
        );

        // Step 3: Reorder ONLY existing images that weren't deleted
        // New images were created with correct index, no need to reorder them
        const reorders: ImageReorderRequest[] = currentImages
            .filter((img) => !!img.id)
            .map((img) => ({
                imageId: img.id!,
                index: img.index,
            }));

        if (reorders.length > 0) {
            await reorderLocationImages(locationId, reorders);
        }

        // Final invalidate to refresh the UI with all changes
        if (imagesToDelete.length > 0 || newImages.length > 0 || reorders.length > 0) {
            await queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(locationId),
            });
        }
    };

    return { updateImages };
}
