import type { ImageRequest } from './types';

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
