import type { LngLat } from 'mapbox-gl';

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
