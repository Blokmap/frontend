import type { Image, ImageBody } from './imageTypes';

/**
 * Converts an Image to an ImageBody for editing.
 *
 * @param image - The image object to convert.
 * @param index - The index of the image.
 * @returns An ImageBody object suitable for forms.
 */
export function imageToBody(image: Image, index: number): ImageBody {
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
