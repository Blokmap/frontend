import { LatLngBounds } from 'leaflet';
import type { Location } from '@/types/model/Location';

/**
 * Generates an array of random locations within the specified bounds.
 *
 * @param {LatLngBounds} bounds - The geographical bounds within which to generate locations.
 * @param {number} [count=50] - The number of locations to generate. Defaults to 50.
 * @returns {Location[]} An array of randomly generated locations.
 */
function getLocationsInBounds(bounds: LatLngBounds, count: number = 50): Location[] {
    const { lat: minLat, lng: minLng } = bounds.getSouthWest();
    const { lat: maxLat, lng: maxLng } = bounds.getNorthEast();

    return Array.from({ length: count }, (_, i) => ({
        name: `Location-${i}-${Math.random().toString(36).substring(7)}`,
        importance: Math.random(),
        coords: {
            lat: minLat + Math.random() * (maxLat - minLat),
            lng: minLng + Math.random() * (maxLng - minLng),
        },
    }));
}

export function useLocationService() {
    // Cache to store generated locations 
    // for each viewport and zoom level.
    const cache = new Map<string, Location[]>();

    /**
     * Generates a cache key based on the provided geographical bounds and zoom level.
     *
     * @param bounds - The geographical bounds represented by a LatLngBounds object.
     * @param zoom - The zoom level as a number.
     * @returns A string that uniquely identifies the cache key for the given bounds and zoom level.
     */
    function getCacheKey(bounds: LatLngBounds, zoom: number): string {
        return `${bounds.toBBoxString()}|${zoom}`;
    }

    /**
     * Clears the cache by removing all entries.
     */
    function clearCache(key?: string) {
        if (key !== undefined) {
            cache.delete(key);
        } else {
            cache.clear();
        }
    }

    /**
     * Retrieves a list of locations within the specified viewport bounds, sorted by importance.
     *
     * If the locations for the given bounds and zoom level are cached, it returns the cached locations.
     *
     * @param bounds - The geographical bounds of the viewport.
     * @param zoom - The zoom level of the map.
     * @param max - The maximum number of locations to return.
     * @returns An array of locations within the specified bounds, sorted by importance, limited to the specified maximum number.
     */
    function getViewportLocations(bounds: LatLngBounds, zoom: number, max: number): Location[] {
        const cacheKey = getCacheKey(bounds, zoom);

        if (cache.has(cacheKey)) {
            return cache.get(cacheKey)!.slice(0, max);
        }

        console.log('Generating new locations for cache key:', cacheKey);

        const newLocations = getLocationsInBounds(bounds).sort(
            (a, b) => b.importance - a.importance,
        );

        cache.set(cacheKey, newLocations);
        return newLocations.slice(0, max);
    }

    return {
        cache,
        getCacheKey,
        getViewportLocations,
        clearCache,
    };
}
