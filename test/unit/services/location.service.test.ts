import { describe, expect, it, beforeEach } from 'vitest';
import { LatLngBounds } from 'leaflet';
import { useLocationService } from '@/composables/services/location.service';
import type { Location } from '@/types/model/Location';

describe('location service', () => {
    const service = useLocationService();
    const testZoom = 12;
    const testMax = 50;
    const testBounds = new LatLngBounds([
        [50, 4],
        [51, 5],
    ]);

    beforeEach(() => {
        service.clearCache();
    });

    it('should generate locations within bounds', () => {
        const locations = service.getViewportLocations(testBounds, testZoom, testMax);

        locations.forEach((location: Location) => {
            expect(location.coords.lat).toBeGreaterThanOrEqual(50);
            expect(location.coords.lat).toBeLessThanOrEqual(51);
            expect(location.coords.lng).toBeGreaterThanOrEqual(4);
            expect(location.coords.lng).toBeLessThanOrEqual(5);
        });
    });

    it('should return cached results for same viewport/zoom', () => {
        const firstCall = service.getViewportLocations(testBounds, testZoom, testMax);
        const secondCall = service.getViewportLocations(testBounds, testZoom, testMax);

        expect(firstCall).toEqual(secondCall);
    });

    it('should generate new results for different viewports', () => {
        const bounds1 = new LatLngBounds([50, 4], [50.5, 4.5]);
        const bounds2 = new LatLngBounds([50.5, 4.5], [51, 5]);

        const call1 = service.getViewportLocations(bounds1, testZoom, testMax);
        const call2 = service.getViewportLocations(bounds2, testZoom, testMax);

        expect(call1).not.toEqual(call2);
    });

    it('should respect max results parameter', () => {
        const results = service.getViewportLocations(testBounds, testZoom, testMax);
        expect(results.length).toBeLessThanOrEqual(testMax);
    });

    it('should sort by importance descending', () => {
        const results = service.getViewportLocations(testBounds, testZoom, testMax);

        for (let i = 1; i < results.length; i++) {
            expect(results[i].importance).toBeLessThanOrEqual(results[i - 1].importance);
        }
    });

    it('should handle zoom level in cache key', () => {
        const call1 = service.getViewportLocations(testBounds, 10, testMax);
        const call2 = service.getViewportLocations(testBounds, 12, testMax);

        expect(call1).not.toEqual(call2);
    });

    it('should use cache for identical viewport and zoom', () => {
        // First call - should populate the cache
        const firstCall = service.getViewportLocations(testBounds, testZoom, testMax);

        // Verify cache is populated
        const cacheKey = service.getCacheKey(testBounds, testZoom);
        expect(service.cache.has(cacheKey)).toBe(true);
        expect(service.cache.get(cacheKey)).toEqual(firstCall);

        // Second call - should return cached results
        const secondCall = service.getViewportLocations(testBounds, testZoom, testMax);
        expect(secondCall).toEqual(firstCall);

        // Test with different bounds - should not return cached results
        const differentBounds = new LatLngBounds([
            [50.5, 4.5],
            [51.5, 5.5],
        ]);
        const thirdCall = service.getViewportLocations(differentBounds, testZoom, testMax);
        expect(thirdCall).not.toEqual(firstCall);

        // Test with different zoom - should not return cached results
        const differentZoom = 10;
        const fourthCall = service.getViewportLocations(testBounds, differentZoom, testMax);
        expect(fourthCall).not.toEqual(firstCall);
    });
});
