import type { Image, ImageRequest } from './types';

/**
 * Converts an Image to an ImageRequest for editing.
 *
 * @param image - The image object to convert.
 * @param index - The index of the image.
 * @returns An ImageRequest object suitable for forms.
 */
export function imageToRequest(image: Image, index: number): ImageRequest {
    return {
        imageUrl: image.url,
        tempUrl: image.url,
        isPrimary: index === 0,
        index: index,
    };
}

/**
 * Get the preview URL for an image.
 * @param image The image to get the preview URL for.
 */
export function getImageRequestPreviewUrl(image: ImageRequest): string {
    if (image.tempUrl) return image.tempUrl;
    if (image.imageUrl) return image.imageUrl;
    if (image.file) return URL.createObjectURL(image.file);
    return '';
}
