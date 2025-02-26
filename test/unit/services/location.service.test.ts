import { describe, it, expect, beforeEach } from 'vitest';
import { LatLngBounds } from 'leaflet';
import { useLocationService } from '@/composables/services/location.service';

describe('useLocationService', () => {
    const service = useLocationService();
    const testZoom = 10;
    const testMax = 75;

    beforeEach(() => {
        service.clearCache();
    });

    it('should reuse cached cells and fetch missing ones when panning', () => {
        const initialBounds = new LatLngBounds([-45, -90], [45, 90]); // Covers center cells
        const pannedBounds = new LatLngBounds([-45, 0], [45, 180]); // Pan east

        // Should cache some cells.
        service.getViewportLocations(initialBounds, testZoom, 100);
        const initialCachedCells = Array.from(service.cache.keys());
        expect(initialCachedCells.length).toBeGreaterThan(0);

        // Some cells should be reused, new ones added.
        service.getViewportLocations(pannedBounds, testZoom, 100);
        const newCachedCells = Array.from(service.cache.keys());

        expect(newCachedCells.length).toBeGreaterThan(initialCachedCells.length);
        expect(initialCachedCells.some((cell) => newCachedCells.includes(cell))).toBe(true);

        // Should be the same object (reference) in cache.
        const initialLocations = service.cache.get(initialCachedCells[0]);
        const newLocations = service.cache.get(newCachedCells[0]);
        expect(initialLocations).toBe(newLocations);
    });

    it('should only return locations within the current viewport bounds', () => {
        const bounds = new LatLngBounds([-45, -90], [45, 90]);
        const locations = service.getViewportLocations(bounds, testZoom, 100);

        // All locations must be inside the requested bounds
        locations.forEach((location) => {
            expect(bounds.contains(location.coords)).toBe(true);
        });
    });

    it('should return <= max locations sorted by importance (desc)', () => {
        const bounds = new LatLngBounds([-45, -90], [45, 90]);

        const locations = service.getViewportLocations(bounds, testZoom, testMax);
        expect(locations.length).toBeLessThanOrEqual(testMax);

        // Check sorting (importance should decrease)
        for (let i = 1; i < locations.length; i++) {
            expect(locations[i].importance).toBeLessThanOrEqual(locations[i - 1].importance);
        }
    });

    it('should clear cached cells when requested', () => {
        const bounds = new LatLngBounds([-45, -90], [45, 90]);

        // Load data to populate cache
        service.getViewportLocations(bounds, testZoom, 100);
        expect(service.cache.size).toBeGreaterThan(0);

        // Clear entire cache
        service.clearCache();
        expect(service.cache.size).toBe(0);

        // Load again and ensure cache is repopulated
        service.getViewportLocations(bounds, testZoom, 100);
        expect(service.cache.size).toBeGreaterThan(0);
    });

    it('should handle viewports spanning multiple cells', () => {
        const wideBounds = new LatLngBounds([-90, -180], [90, 180]); // Entire world

        const locations = service.getViewportLocations(wideBounds, testZoom, 1000);
        const cells = service.getViewportCells(wideBounds, testZoom);

        // Should fetch from all cells in the viewport
        expect(cells.length).toBeGreaterThan(1);
        expect(service.cache.size).toBe(cells.length);
        expect(locations.length).toBe(1000); // Max is respected
    });
});
