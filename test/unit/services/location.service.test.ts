import { useLocationService } from '@/composables/services/useLocationService';
import { LatLngBounds } from 'leaflet';
import { describe, expect, it, beforeEach } from 'vitest';

describe('useLocationService', () => {
    const service = useLocationService();

    beforeEach(() => {
        service.cache.clear();
    });

    it('returns locations within the specified bounds', () => {
        const bounds = new LatLngBounds([50.8, 3.0], [51.1, 4.0]);
        const locations = service.getViewportLocations(bounds, 1000);

        // Ensure all returned locations are within the bounds
        expect(locations.every((l) => bounds.contains(l.coords))).toBe(true);
    });

    it('respects the max parameter', () => {
        const bounds = new LatLngBounds([50.8, 3.0], [51.1, 4.0]);
        const max = 5;
        const locations = service.getViewportLocations(bounds, max);

        // Ensure the number of returned locations does not exceed the max
        expect(locations.length).toBeLessThanOrEqual(max);
    });

    it('sorts locations by descending importance', () => {
        const bounds = new LatLngBounds([50.8, 3.0], [51.1, 4.0]);
        const locations = service.getViewportLocations(bounds, 1000);

        // Ensure locations are sorted by importance in descending order
        for (let i = 1; i < locations.length; i++) {
            expect(locations[i - 1].importance).toBeGreaterThanOrEqual(
                locations[i].importance,
            );
        }
    });

    it('uses cached data when available', () => {
        const boundsLarge = new LatLngBounds([50.8, 3.0], [51.1, 4.0]);
        const boundsSmall = new LatLngBounds([51.0, 3.0], [51.1, 3.1]);

        // First call (cache miss)
        const result1 = service.getViewportLocations(boundsLarge, 1000);
        expect(result1.length).toBeGreaterThan(0);

        // Second call (cache hit)
        const result2 = service.getViewportLocations(boundsSmall, 1000);
        expect(result2.length).toBeGreaterThan(0);

        // Ensure the results are filtered from the cached data
        expect(
            result2.every((l) => boundsSmall.contains(l.coords as any)),
        ).toBe(true);
    });

    it('removes subset cached bounds when adding superset', () => {
        const boundsSmall = new LatLngBounds([51.0, 3.0], [51.1, 3.1]);
        const boundsLarge = new LatLngBounds([50.8, 3.0], [51.1, 4.0]);

        // Cache the smaller bounds
        service.getViewportLocations(boundsSmall, 1000);
        expect(service.cache.has(boundsSmall)).toBe(true);

        // Cache the larger bounds, which should remove the smaller bounds
        service.getViewportLocations(boundsLarge, 1000);
        expect(service.cache.has(boundsSmall)).toBe(false);
        expect(service.cache.has(boundsLarge)).toBe(true);
    });

    it('adds new entry to cache on fetch', () => {
        const bounds = new LatLngBounds([51.0, 3.0], [51.1, 3.1]);

        // Fetch data and ensure it's added to the cache
        service.getViewportLocations(bounds, 1000);
        expect(service.cache.has(bounds)).toBe(true);
    });

    it('does not use cache when no containing bounds exist', () => {
        const boundsSmall = new LatLngBounds([51.0, 3.0], [51.1, 3.1]);
        const boundsOther = new LatLngBounds([50.0, 2.0], [52.0, 5.0]);

        // Cache the smaller bounds
        service.getViewportLocations(boundsSmall, 1000);
        expect(service.cache.has(boundsSmall)).toBe(true);

        // Fetch data for a different bounds, which should not use the cache
        const result = service.getViewportLocations(boundsOther, 1000);
        expect(service.cache.has(boundsSmall)).toBe(false);
        expect(service.cache.has(boundsOther)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('returns an empty array if no locations are within bounds', () => {
        const bounds = new LatLngBounds([0, 0], [1, 1]); // Bounds with no locations
        const locations = service.getViewportLocations(bounds, 1000);

        // Ensure no locations are returned
        expect(locations).toHaveLength(0);
    });
});
