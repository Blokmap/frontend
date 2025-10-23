import mapboxgl from 'mapbox-gl';
import { type Ref, isRef, onActivated, onMounted, onUnmounted, readonly, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { DEFAULT_MAP_OPTIONS } from '@/domain/map';
import type { LngLat, LngLatBounds, MapAdapter, MapOptions, Marker } from '@/domain/map';

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
    options: MapOptions = DEFAULT_MAP_OPTIONS,
): MapAdapter<T> {
    const { locale } = useI18n();

    // Merge default options with provided options
    // This allows for overriding default values while keeping the defaults intact.
    options = {
        ...DEFAULT_MAP_OPTIONS,
        ...options,
    };

    // Bypass deep type inference issues with mapbox-gl types
    // by explictely casting the correct types.
    const markers = new Map<T, mapboxgl.Marker>() as Map<T, mapboxgl.Marker>;
    const map = ref(null) as Ref<mapboxgl.Map | null>;

    const markerCount = ref(0);
    const isLoaded = ref(false);
    const isMoving = ref(false);
    const isZooming = ref(false);
    const isDragging = ref(false);

    // Handle MaybeRef options - convert to reactive refs or use provided refs
    const center = isRef(options.center) ? options.center : ref<LngLat>(options.center || [0, 0]);
    const zoom = isRef(options.zoom) ? options.zoom : ref<number>(options.zoom || 1);
    const maxBounds = isRef(options.maxBounds) ? options.maxBounds : ref(options.maxBounds);

    const bounds: Ref<LngLatBounds> = ref([
        [-180, -90],
        [180, 90],
    ]);

    onMounted(() => {
        if (container.value === null) {
            console.error('Map container is not defined, cannot initialize map');
            return;
        }

        // Configuration //

        const newMap = new mapboxgl.Map({
            accessToken: MAPBOX_ACCESS_TOKEN,
            language: locale.value,
            container: container.value,
            style: options.style,
            center: center.value,
            maxBounds: maxBounds.value,
            zoom: zoom.value,
            interactive: options.interactive,
        });

        // Listeners //

        newMap.on('move', async () => {
            isMoving.value = true;

            const mapBounds = newMap.getBounds();
            const mapCenter = newMap.getCenter();

            if (mapCenter) {
                center.value = [mapCenter.lng, mapCenter.lat];
            }

            if (mapBounds) {
                bounds.value = [
                    [mapBounds.getSouthWest().lng, mapBounds.getSouthWest().lat],
                    [mapBounds.getNorthEast().lng, mapBounds.getNorthEast().lat],
                ];
            }
        });

        newMap.on('zoom', async () => {
            isZooming.value = true;

            const mapZoom = newMap.getZoom();

            if (mapZoom) {
                zoom.value = mapZoom;
            }
        });

        newMap.on('moveend', () => {
            isMoving.value = false;
        });

        newMap.on('zoomend', () => {
            isZooming.value = false;
        });

        newMap.once('load', () => {
            isLoaded.value = true;

            const mapBounds = newMap.getBounds();

            if (mapBounds) {
                bounds.value = [
                    [mapBounds.getSouthWest().lng, mapBounds.getSouthWest().lat],
                    [mapBounds.getNorthEast().lng, mapBounds.getNorthEast().lat],
                ];
            }
        });

        // Geolocation configuration //

        if (options.geoLocationControl) {
            const geoLocateControl = new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
            });

            newMap.addControl(geoLocateControl);

            geoLocateControl.on('geolocate', (position) => {
                const { longitude, latitude } = position.coords;

                newMap.flyTo({
                    center: [longitude, latitude],
                    zoom: 17,
                    duration: 1500,
                    essential: true,
                });
            });

            if (options.autoGeolocation) {
                newMap.once('load', () => {
                    if (options.autoGeolocation) {
                        geoLocateControl.trigger();
                    }
                });
            }
        }

        map.value = newMap;
    });

    onActivated(() => {
        if (map.value) {
            try {
                map.value?.resize();
            } catch (error) {
                console.warn('Map resize on activation failed:', error);
            }
        }
    });

    onUnmounted(() => {
        map.value?.remove();
    });

    watch(maxBounds, (newBounds) => {
        const bounds = newBounds ?? [
            [-180, -90],
            [180, 90],
        ];
        map.value?.setMaxBounds(bounds);
    });

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

    watch(zoom, (newZoom) => {
        if (!map.value || !isLoaded.value) return;

        const currentZoom = map.value.getZoom();
        const tolerance = 0.01;

        if (Math.abs(currentZoom - newZoom) > tolerance) {
            map.value.setZoom(newZoom);
        }
    });

    /**
     * Adds a marker to the map.
     *
     * @param marker - The marker to add, containing an identifier, coordinates, and an HTML element.
     */
    function addMarker(marker: Marker<T>): void {
        if (!map.value) {
            console.error('Map is not initialized, cannot add marker');
            return;
        }

        const { id, coord, el } = marker;
        const mbMarker = new mapboxgl.Marker(el).setLngLat(coord).addTo(map.value);
        markers.set(id, mbMarker);
        markerCount.value = markers.size;
    }

    /**
     * Removes a marker from the map by its identifier.
     *
     * @param id - The identifier of the marker to remove.
     */
    function removeMarker(id: T): void {
        markers.get(id)?.remove();
        markers.delete(id);
        markerCount.value = markers.size;
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
     * Flies the map to the specified bounds.
     *
     * @param bounds - The bounds to fly to, defined by southwest and northeast coordinates.
     * @returns A promise that resolves when the animation completes.
     */
    function flyToBounds(bounds: LngLatBounds): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!map.value) {
                const error = new Error('Map is not initialized, cannot fly to bounds');
                console.error(error.message);
                return reject(error);
            }

            const sw = new mapboxgl.LngLat(bounds[0][0], bounds[0][1]);
            const ne = new mapboxgl.LngLat(bounds[1][0], bounds[1][1]);
            const mapBounds = new mapboxgl.LngLatBounds(sw, ne);

            map.value.once('moveend', () => resolve());

            map.value.fitBounds(mapBounds, {
                padding: { top: 20, bottom: 20, left: 20, right: 20 },
                duration: 1000,
            });
        });
    }

    /**
     * Flies the map to the specified longitude and latitude.
     *
     * @param lngLat - The longitude and latitude to fly to.
     * @returns A promise that resolves when the animation completes.
     */
    function flyTo(lngLat: LngLat, zoom: number = 16): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!map.value) {
                const error = new Error('Map is not initialized, cannot fly to location');
                console.error(error.message);
                return reject(error);
            }

            map.value.once('moveend', () => resolve());

            map.value.flyTo({
                center: lngLat,
                zoom,
                duration: 1000,
                essential: true,
            });
        });
    }

    return {
        setMarkers,
        addMarker,
        removeMarker,
        flyToBounds,
        flyTo,
        center,
        zoom,
        bounds: bounds,
        isLoaded: readonly(isLoaded),
        isDragging: readonly(isDragging),
        isZooming: readonly(isZooming),
        isMoving: readonly(isMoving),
    };
}
