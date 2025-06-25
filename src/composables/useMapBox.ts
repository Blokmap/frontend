import Marker from '@/components/features/map/Marker.vue';
import { defaultMapOptions } from '@/config/map';
import type { LngLat, LngLatBounds, MapAdapter, MapOptions } from '@/types/contract/Map';
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
    const isLoaded = computed(() => map.value !== null);

    const markerClickCallback = ref<(id: T, event: MouseEvent) => void>(() => null);

    onMounted(() => {
        if (container.value === null) {
            return;
        }

        const newMap = new mapboxgl.Map({
            accessToken: MAPBOX_ACCESS_TOKEN,
            language: locale.value,
            container: container.value,
            style: options.style ?? defaultMapOptions.style,
            center: options.center ?? defaultMapOptions.center,
            maxBounds: options.bounds ?? defaultMapOptions.bounds,
            zoom: options.zoom ?? defaultMapOptions.zoom,
        });

        map.value = newMap;
    });

    onUnmounted(() => {
        map.value?.remove();
        for (const [key] of markers) {
            removeMarker(key);
        }
    });

    /**
     * Removes a marker from the map.
     *
     * @param id - The identifier of the marker to remove.
     */
    function removeMarker(id: T): void {
        const marker = markers.get(id);
        if (!marker) return;

        const el = marker.getElement();
        render(null, el);
        marker.remove();
        markers.delete(id);
    }

    /**
     * Adds a marker to the map.
     *
     * @param id - The identifier for the marker.
     * @param lngLat - The longitude and latitude coordinates for the marker.
     */
    function addMarker(id: T, lngLat: LngLat): void {
        if (!map.value) return;

        const element = document.createElement('div');
        element.addEventListener('click', (event) => {
            markerClickCallback.value(id, event);
        });

        const vnode = h(Marker);
        render(vnode, element);

        const marker = new mapboxgl.Marker({ element }).setLngLat(lngLat).addTo(map.value);

        markers.set(id, marker);
    }

    /**
     * Sets markers on the map.
     *
     * @param entries - An array of tuples containing the marker identifier and its longitude/latitude coordinates.
     */
    function setMarkers(entries: Array<[T, LngLat]>): void {
        const newIds = new Set(entries.map(([id]) => id));
        const existingIds = new Set(markers.keys());

        // Add new markers
        for (const [id, lngLat] of entries) {
            if (!markers.has(id)) {
                addMarker(id, lngLat);
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
     * Sets a callback to be called when a marker is clicked.
     *
     * @param callback - A function that will be called with the marker's identifier and its coordinates.
     */
    function setOnMarkerClick(callback: (id: T, event: MouseEvent) => void): void {
        markerClickCallback.value = callback;
    }

    return { setMarkers, setOnBoundsChange, setOnMarkerClick, setOnMove, isLoaded };
}
