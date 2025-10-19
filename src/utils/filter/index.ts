import { formatDate } from '@vueuse/core';
import { dateToString } from '../date';
import { timeToString } from '../time';
import type { LngLatBounds, LngLat } from '@/domain/map';

export * from './types';

/**
 * Format filters by converting dates and times to strings and removing nullish values.
 * This is a generic filter formatter that handles common data types.
 *
 * @param filters - The filters to format.
 * @param dateOnlyOverrides - Array of keys that should be formatted as date-only (YYYY-MM-DD) instead of date-time.
 * @returns The formatted filters.
 */
export function formatFilters<T extends Record<string, any>>(
    filters: T,
    dateOnlyOverrides: (keyof T)[] = [],
): Record<string, any> {
    const result: Record<string, any> = { ...filters };

    for (const key in result) {
        const value = result[key];

        // Remove null or undefined values
        if (value === null || value === undefined) {
            delete result[key];
            continue;
        }

        // Format dates to strings
        if (value instanceof Date) {
            if (dateOnlyOverrides.includes(key)) {
                result[key] = formatDate(value, 'YYYY-MM-DD');
            } else {
                result[key] = dateToString(value);
            }
            continue;
        }

        // Format times to HH:MM strings
        if (typeof value === 'object' && 'hours' in value && 'minutes' in value) {
            result[key] = timeToString(value);
        }
    }

    return result;
}

/**
 * Format location search filters by handling special location-specific properties.
 * This includes bounds, center with radius, and openOn transformation.
 *
 * @param filters - The location search filters to format.
 * @param dateOnlyOverrides - Array of keys that should be formatted as date-only (YYYY-MM-DD).
 * @returns The formatted filters ready for API consumption.
 */
export function formatLocationSearchFilters<T extends Record<string, any>>(
    filters: T,
    dateOnlyOverrides: (keyof T)[] = [],
): Record<string, any> {
    const result: Record<string, any> = { ...filters };

    // Handle bounds: [[lng, lat], [lng, lat]] -> separate coordinate parameters
    if ('bounds' in result && result.bounds !== null && result.bounds !== undefined) {
        const bounds = result.bounds as LngLatBounds;
        const [southWest, northEast] = bounds;
        delete result.bounds;

        if (southWest && northEast) {
            result.southWestLng = southWest[0];
            result.southWestLat = southWest[1];
            result.northEastLng = northEast[0];
            result.northEastLat = northEast[1];
        }
    }

    // Handle center: { coords: [lng, lat], radius?: number } -> separate parameters
    if ('center' in result && result.center !== null && result.center !== undefined) {
        const center = result.center as { coords: LngLat; radius?: number | null };
        delete result.center;

        if (center.coords) {
            result.centerLng = center.coords[0];
            result.centerLat = center.coords[1];
        }

        if (center.radius !== null && center.radius !== undefined) {
            result.distance = center.radius;
        }
    }

    // Handle openOn -> openOnDay transformation
    if ('openOn' in result && result.openOn !== null && result.openOn !== undefined) {
        const openOn = result.openOn;
        delete result.openOn;

        if (openOn instanceof Date) {
            result.openOnDay = dateToString(openOn);
        }
    }

    // Apply generic filter formatting (dates, times, nullish removal)
    return formatFilters(result, dateOnlyOverrides as string[]);
}
