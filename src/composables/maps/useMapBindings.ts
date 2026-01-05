import { watch, type Ref } from 'vue';
import type { LngLat, LngLatBounds } from '@/domain/map';

/**
 * Setup two-way binding between refs and map instance.
 * This logic can be reused across different map implementations (Mapbox, Leaflet, etc.).
 *
 * @param map - Reference to the map instance (any type to support different map libraries).
 * @param isLoaded - Reference indicating if the map is fully loaded.
 * @param center - Reference to the map center coordinates.
 * @param zoom - Reference to the map zoom level.
 * @param maxBounds - Reference to the map maximum bounds.
 */
export function useMapBindings(
    map: Ref<any>,
    isLoaded: Ref<boolean>,
    center: Ref<LngLat>,
    zoom: Ref<number>,
    maxBounds: Ref<LngLatBounds | undefined>,
) {
    // Watch maxBounds changes and update map
    watch(maxBounds, (newBounds) => {
        const bounds = newBounds ?? [
            [-180, -90],
            [180, 90],
        ];
        map.value?.setMaxBounds(bounds as [LngLat, LngLat]);
    });

    // Watch center changes and update map
    watch(
        center,
        (newCenter) => {
            if (!map.value || !isLoaded.value) return;

            const currentCenter = map.value.getCenter();
            const tolerance = 0.000001;

            if (
                Math.abs(currentCenter.lng - newCenter[0]) > tolerance ||
                Math.abs(currentCenter.lat - newCenter[1]) > tolerance
            ) {
                map.value.setCenter(newCenter);
            }
        },
        { deep: true },
    );

    // Watch zoom changes and update map
    watch(zoom, (newZoom) => {
        if (!map.value || !isLoaded.value) return;

        const currentZoom = map.value.getZoom();
        const tolerance = 0.01;

        if (Math.abs(currentZoom - newZoom) > tolerance) {
            map.value.setZoom(newZoom);
        }
    });
}
