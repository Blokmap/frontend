import placeholder1 from '@/assets/img/placeholder/location-stock-1.jpg';
import placeholder2 from '@/assets/img/placeholder/location-stock-2.jpg';
import placeholder3 from '@/assets/img/placeholder/location-stock-3.jpg';
import type { Image, ImageBody } from './imageTypes';
import type { Location } from '../location';

/**
 * Returns up to 3 recent location images, filled with placeholders if needed.
 * @param locations Array of locations, each with an images array
 */
export function getLocationImages(locations?: Location[]): Image[] {
    const allImages = (locations ?? []).flatMap((loc, locIdx) =>
        (loc.images ?? []).map((img) => ({ img, locIdx })),
    );

    const sortedImages = allImages.sort((a, b) => {
        if (a.img.index !== b.img.index) {
            return a.img.index - b.img.index;
        }
        return a.locIdx - b.locIdx;
    });

    const images = sortedImages.map((x) => x.img).slice(0, 3);

    const PLACEHOLDERS: string[] = [placeholder1, placeholder2, placeholder3];

    if (images.length < 3) {
        const missing = 3 - images.length;
        for (let i = 0; i < missing; i++) {
            images.push({
                id: -1 - i,
                url: PLACEHOLDERS[i % PLACEHOLDERS.length],
                index: images.length + i,
            });
        }
    }

    return images;
}

/**
 * Converts an Image to an ImageBody for editing.
 *
 * @param image - The image object to convert.
 * @param index - The index of the image.
 * @returns An ImageBody object suitable for forms.
 */
export function imageToRequest(image: Image, index: number): ImageBody {
    return {
        id: image.id,
        imageUrl: image.url,
        tempUrl: image.url,
        index,
    };
}

/**
 * Get the preview URL for an image.
 * @param image The image to get the preview URL for.
 */
export function getImageBodyPreviewUrl(image: ImageBody): string {
    if (image.tempUrl) return image.tempUrl;
    if (image.imageUrl) return image.imageUrl;
    if (image.file) return URL.createObjectURL(image.file);
    return '';
}

/**
 * Sorts an array of images by their index property in ascending order.
 *
 * @param images Array of Image objects to sort
 * @returns New array of Image objects sorted by index
 */
export function sortImagesByIndex<T extends { index: number }>(images: T[]): T[] {
    return [...images].sort((a, b) => a.index - b.index);
}
