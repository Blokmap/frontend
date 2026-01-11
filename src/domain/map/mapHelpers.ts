import type { LngLat, LngLatBounds } from './types';

/**
 * Type guard to check if a value is a valid LngLat tuple.
 *
 * @param lngLat - The value to check.
 * @returns True if the value is a LngLat tuple, false otherwise.
 */
export function isLngLat(lngLat: any): lngLat is LngLat {
    if (!Array.isArray(lngLat) || lngLat.length !== 2) {
        return false;
    }

    const [lng, lat] = lngLat;

    return +lng >= -180 && +lng <= 180 && +lat >= -90 && +lat <= 90;
}

/**
 * Type guard to check if a value is a valid LngLatBounds tuple.
 *
 * @param bounds - The value to check.
 * @returns True if the value is a LngLatBounds tuple, false otherwise.
 */
export function isLngLatBounds(bounds: any): bounds is LngLatBounds {
    if (!Array.isArray(bounds) || bounds.length !== 2) {
        return false;
    }

    return isLngLat(bounds[0]) && isLngLat(bounds[1]);
}

/**
 * Calculate bounds from an array of coordinates with optional padding.
 *
 * @param coordinates - Array of LngLat coordinates.
 * @param paddingPercent - Percentage of padding to add to each side (default: 0.1 = 10%).
 * @returns Bounds as LngLatBounds or undefined if no coordinates.
 */
export function calculateBounds(
    coordinates: LngLat[],
    paddingPercent: number = 0.1,
): LngLatBounds | undefined {
    if (!coordinates || coordinates.length === 0) {
        return undefined;
    }

    const lngs = coordinates.map((coord) => coord[0]);
    const lats = coordinates.map((coord) => coord[1]);

    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);

    // Add padding (default 10% on each side)
    const lngPadding = (maxLng - minLng) * paddingPercent || 0.01;
    const latPadding = (maxLat - minLat) * paddingPercent || 0.01;

    return [
        [minLng - lngPadding, minLat - latPadding],
        [maxLng + lngPadding, maxLat + latPadding],
    ];
}

/**
 * Calculate the center point from bounds or coordinates.
 *
 * @param boundsOrCoordinates - Either LngLatBounds or array of LngLat coordinates.
 * @param defaultCenter - Default center to use if no bounds/coordinates provided.
 * @returns Center as LngLat.
 */
export function calculateCenter(
    boundsOrCoordinates: LngLatBounds | LngLat[] | undefined,
    defaultCenter: LngLat = [4.4764595, 50.5010789],
): LngLat {
    if (!boundsOrCoordinates || boundsOrCoordinates.length === 0) {
        return defaultCenter;
    }

    // Check if it's bounds
    if (isLngLatBounds(boundsOrCoordinates)) {
        const [[minLng, minLat], [maxLng, maxLat]] = boundsOrCoordinates;
        return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
    }

    // Otherwise treat as array of coordinates
    const bounds = calculateBounds(boundsOrCoordinates);

    if (!bounds) {
        return defaultCenter;
    }

    const [[minLng, minLat], [maxLng, maxLat]] = bounds;
    return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}
