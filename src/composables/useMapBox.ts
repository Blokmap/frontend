import { defaultMapOptions } from '@/config/map';
import type { LngLat, LngLatBounds, MapAdapter, MapOptions, Marker } from '@/types/contract/Map';
import mapboxgl from 'mapbox-gl';
import { type Ref, computed, h, onMounted, onUnmounted, ref, render } from 'vue';
import { useI18n } from 'vue-i18n';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

/**
 * Composable to create a MapBox map instance.
 *
 * @param container - A reference to the HTML element that will contain the map.
 * @param options - Optional configuration options for the map.
 * @returns - An object containing the map instance.
 */
export function useMapBox<T>(
    container: Ref<HTMLElement | null>,
    options: MapOptions = defaultMapOptions,
): MapAdapter<T> {
    const { locale } = useI18n();

    // Bypass deep type inference issues with mapbox-gl types
    // by explictely casting the correc types.
    const markers = new Map<T, mapboxgl.Marker>() as Map<T, mapboxgl.Marker>;
    const map = ref(null) as Ref<mapboxgl.Map | null>;

    const isLoaded = computed(() => map.value !== null && map.value.loaded());
    const isMoving = computed(() => map.value !== null && map.value.isMoving());

    onMounted(() => {
        if (container.value === null) {
            return;
        }

        const newMap = new mapboxgl.Map({
            accessToken: MAPBOX_ACCESS_TOKEN,
            language: locale.value,
            container: container.value,
            style: options.style,
            center: options.center,
            maxBounds: options.bounds,
            zoom: options.zoom,
        });

        // Add geolocate control to the map.
        newMap.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
            }),
        );

        map.value = newMap;
    });

    onUnmounted(() => {
        map.value?.remove();
    });

    /**
     * Adds a marker to the map.
     *
     * @param marker - The marker to add, containing an identifier, coordinates, and an HTML element.
     */
    function addMarker(marker: Marker<T>): void {
        if (!map.value) return;
        const { id, coord, el } = marker;
        const mbMarker = new mapboxgl.Marker(el).setLngLat(coord).addTo(map.value);
        markers.set(id, mbMarker);
    }

    /**
     * Removes a marker from the map by its identifier.
     *
     * @param id - The identifier of the marker to remove.
     */
    function removeMarker(id: T): void {
        markers.get(id)?.remove();
        markers.delete(id);
    }

    /**
     * Sets markers on the map.
     *
     * @param entries - An array of tuples containing the marker identifier and its longitude/latitude coordinates.
     */
    function setMarkers(entries: Marker<T>[]): void {
        const newIds = new Set(entries.map((marker) => marker.id));
        const existingIds = new Set(markers.keys());

        // Add new markers
        for (const marker of entries) {
            if (!markers.has(marker.id)) {
                addMarker(marker);
            }
        }

        // Remove stale markers
        for (const id of existingIds) {
            if (!newIds.has(id)) {
                removeMarker(id);
            }
        }
    }

    /**
     * Sets a callback to be called when the map's bounds change.
     *
     * @param callback - A function that will be called with the new bounds of the map.
     */
    function setOnBoundsChange(callback: (bounds: LngLatBounds) => void): void {
        map.value?.on('moveend', () => {
            const bounds = map.value?.getBounds();

            if (bounds) {
                callback([bounds.getSouthWest().toArray(), bounds.getNorthEast().toArray()]);
            }
        });
    }

    /**
     * Sets a callback to be called when the map is moved.
     *
     * @param callback - A function that will be called with the new center of the map.
     */
    function setOnMove(callback: (lngLat: LngLat) => void): void {
        map.value?.on('move', () => {
            const center = map.value?.getCenter();
            if (center) {
                callback(center.toArray());
            }
        });
    }

    /**
     * Flies the map to the specified bounds.
     *
     * @param bounds - The bounds to fly to, defined by southwest and northeast coordinates.
     */
    function flyToBounds(bounds: LngLatBounds): void {
        if (!map.value) return;

        const sw = new mapboxgl.LngLat(bounds[0][0], bounds[0][1]);
        const ne = new mapboxgl.LngLat(bounds[1][0], bounds[1][1]);
        const mapBounds = new mapboxgl.LngLatBounds(sw, ne);

        map.value.fitBounds(mapBounds, {
            padding: { top: 20, bottom: 20, left: 20, right: 20 },
            duration: 1000,
        });
    }

    /**
     * Flies the map to the specified longitude and latitude.
     *
     * @param lngLat - The longitude and latitude to fly to.
     */
    function flyTo(lngLat: LngLat): void {
        if (!map.value) return;

        map.value.flyTo({
            center: lngLat,
            zoom: 12,
            duration: 1000,
            essential: true,
        });
    }

    /**
     * Returns the current bounds of the map.
     *
     * @returns - The current bounds of the map as an array of southwest and northeast coordinates.
     */
    function getBounds(): LngLatBounds | null {
        if (!map.value) return null;

        const bounds = map.value.getBounds();

        if (!bounds) return null;

        return [
            [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
            [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
        ];
    }

    return {
        setMarkers,
        addMarker,
        removeMarker,
        setOnBoundsChange,
        setOnMove,
        flyToBounds,
        flyTo,
        getBounds,
        isLoaded,
        isMoving,
    };
}
