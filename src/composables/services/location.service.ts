import { LatLngBounds } from 'leaflet';
import type { Cell, CellKey, Location } from '@/types/model/Location';
import { blokmapConfig } from '@/config/blokmap.config';

const allLocations = getLocationsInBounds(blokmapConfig.bounds);

function getLocationsInBounds(bounds: LatLngBounds, count: number = 1000): Location[] {
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

export function useLocationService(cellSize: number = 0.5) {
    const cache = new Map<string, Location[]>();
    const cellCache = new Map<number, Cell>();

    /**
     * Get the dimensions of a cell at a given zoom level.
     */
    function getCellDimensions(zoom: number): Cell {
        if (!cellCache.has(zoom)) {
            const rows = Math.ceil(180 / cellSize);
            const cols = Math.ceil(360 / cellSize);

            cellCache.set(zoom, {
                sizeLat: cellSize,
                sizeLng: cellSize,
                rows,
                cols,
            });
        }

        return cellCache.get(zoom)!;
    }

    /**
     * Get the cells that are visible in the current viewport.
     */
    function getViewportCells(bounds: LatLngBounds, zoom: number): CellKey[] {
        const { sizeLat, sizeLng } = getCellDimensions(zoom);
        const cells: CellKey[] = [];

        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        const startRow = Math.floor((sw.lat + 90) / sizeLat);
        const endRow = Math.floor((ne.lat + 90) / sizeLat);
        const startCol = Math.floor((sw.lng + 180) / sizeLng);
        const endCol = Math.floor((ne.lng + 180) / sizeLng);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                cells.push({ zoom, row, col });
            }
        }

        return cells;
    }

    /**
     * Get the cache key for a specific cell.
     */
    function getCacheKey(cell: CellKey): string {
        return `${cell.zoom}-${cell.row}-${cell.col}`;
    }

    /**
     * Clear the cache for a specific cell or all cells.
     */
    const clearCache = (key?: string): void => {
        if (key) cache.delete(key);
        else cache.clear();
    };

    /**
     * Get the locations that are visible in the current viewport.
     */
    function getViewportLocations(bounds: LatLngBounds, zoom: number, max: number): Location[] {
        const cells = getViewportCells(bounds, zoom);
        const results: Location[] = [];
        const missingCells: CellKey[] = [];

        cells.forEach((cell) => {
            const key = getCacheKey(cell);

            if (cache.has(key)) {
                results.push(...cache.get(key)!);
            } else {
                missingCells.push(cell);
            }
        });

        if (missingCells.length > 0) {
            const { sizeLat, sizeLng } = getCellDimensions(zoom);

            // Simulate fetching locations from a server.
            console.log(`Fetching ${missingCells.length} cells from the server...`);

            const sw = missingCells.reduce(
                (acc, cell) => ({
                    lat: Math.min(acc.lat, -90 + cell.row * sizeLat),
                    lng: Math.min(acc.lng, -180 + cell.col * sizeLng),
                }),
                { lat: 90, lng: 180 },
            );

            const ne = missingCells.reduce(
                (acc, cell) => ({
                    lat: Math.max(acc.lat, -90 + (cell.row + 1) * sizeLat),
                    lng: Math.max(acc.lng, -180 + (cell.col + 1) * sizeLng),
                }),
                { lat: -90, lng: -180 },
            );

            const bounds = new LatLngBounds([sw.lat, sw.lng], [ne.lat, ne.lng]);

            const viewportLocations = allLocations
                .filter((l) => bounds.contains(l.coords))
                .slice(0, max);

            missingCells.forEach((cell) => {
                const cellBounds = new LatLngBounds(
                    [-90 + cell.row * sizeLat, -180 + cell.col * sizeLng],
                    [-90 + (cell.row + 1) * sizeLat, -180 + (cell.col + 1) * sizeLng],
                );

                const cellLocations = viewportLocations.filter((l) =>
                    cellBounds.contains(l.coords),
                );

                const key = getCacheKey(cell);
                cache.set(key, cellLocations);
                results.push(...cellLocations);
            });
        }

        return results.sort((a, b) => b.importance - a.importance).slice(0, max);
    }

    return {
        cache,
        getViewportLocations,
        getViewportCells,
        clearCache,
    };
}
