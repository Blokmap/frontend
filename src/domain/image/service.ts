import type { Image } from './types';

/**
 * Parses an Image response object.
 *
 * @param data - The raw image data from the API.
 * @returns The parsed Image object.
 */
export function parseImageResponse(data: any): Image {
    if (!data) return data;

    const result: Image = {
        ...data,
    };

    return result;
}
