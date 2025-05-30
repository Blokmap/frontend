import { LatLngBounds } from 'leaflet';
import type { Location } from '@/types/model/Location';
import { useCache } from '@/composables/useCache';

const allLocations = getLocationsInBounds(
    new LatLngBounds([50.777634, 2.848489], [51.264321, 5.401258]),
);

function getLocationsInBounds(bounds: LatLngBounds, count: number = 10_000): Location[] {
    const { lat: minLat, lng: minLng } = bounds.getSouthWest();
    const { lat: maxLat, lng: maxLng } = bounds.getNorthEast();

    return Array.from({ length: count }, (_, i) => ({
        id: i,
        name: `Location-${i}-${Math.random().toString(36).substring(7)}`,
        importance: Math.random(),
        coords: {
            lat: minLat + Math.random() * (maxLat - minLat),
            lng: minLng + Math.random() * (maxLng - minLng),
        },
    }));
}

export function useLocationService() {
    const { cache } = useCache<LatLngBounds, Location[]>();

    /**
     * Get the locations that are visible in the current viewport.
     */
    function getViewportLocations(bounds: LatLngBounds, max: number): Location[] {
        // Check if the locations are already cached.
        for (const [cachedBounds, cachedLocations] of cache.entries()) {
            if (cachedBounds.contains(bounds)) {
                return cachedLocations.filter((l) => bounds.contains(l.coords)).slice(0, max);
            }
        }

        // Mimick an API call to get the locations in the current viewport.
        console.log('Fetching...');

        const locations = allLocations
            .filter((l) => bounds.contains(l.coords))
            .sort((a, b) => b.importance - a.importance);

        // Remove any cached bounds that are a subset of the current bounds.
        for (const cachedBounds of cache.keys()) {
            if (bounds.contains(cachedBounds)) {
                cache.delete(cachedBounds);
            }
        }

        cache.set(bounds, locations);

        return locations.slice(0, max);
    }

    return {
        cache,
        getViewportLocations,
    };
}
