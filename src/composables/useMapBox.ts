import { defaultMapOptions } from '@/config/map';
import type { LngLat, LngLatBounds, MapAdapter, MapOptions, Marker } from '@/types/contract/Map';
import mapboxgl from 'mapbox-gl';
import { type MaybeRef, type Ref, onMounted, onUnmounted, ref, unref, watch } from 'vue';
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
    center?: MaybeRef<LngLat>,
    zoom?: MaybeRef<number>,
): MapAdapter<T> {
    const { locale } = useI18n();

    // Merge default options with provided options
    // This allows for overriding default values while keeping the defaults intact.
    options = {
        ...defaultMapOptions,
        ...options,
    };

    // Bypass deep type inference issues with mapbox-gl types
    // by explictely casting the correc types.
    const markers = new Map<T, mapboxgl.Marker>() as Map<T, mapboxgl.Marker>;
    const map = ref(null) as Ref<mapboxgl.Map | null>;

    const markerCount = ref(0);
    const isLoaded = ref(false);
    const isMoving = ref(false);

    onMounted(() => {
        if (container.value === null) {
            return console.error('Map container is not defined, cannot initialize map');
        }

        const newMap = new mapboxgl.Map({
            accessToken: MAPBOX_ACCESS_TOKEN,
            language: locale.value,
            container: container.value,
            style: options.style,
            center: center ? unref(center) : options.center,
            maxBounds: options.bounds,
            zoom: zoom ? unref(zoom) : options.zoom,
        });

        newMap.on('move', () => {
            isMoving.value = true;
        });

        newMap.on('moveend', () => {
            isMoving.value = false;
        });

        // Add geolocate control to the map
        const geoLocateControl = new mapboxgl.GeolocateControl({
            positionOptions: { enableHighAccuracy: true },
        });

        newMap.addControl(geoLocateControl);

        // Override the default geolocate control behavior
        // to fly to the user's location when geolocated.
        geoLocateControl.on('geolocate', (position) => {
            const { longitude, latitude } = position.coords;

            newMap.flyTo({
                center: [longitude, latitude],
                zoom: 12,
                duration: 1500,
                essential: true,
            });
        });

        newMap.once('load', () => {
            isLoaded.value = true;
            geoLocateControl.trigger();
        });

        map.value = newMap;

        // Watch for center changes and update map
        if (center) {
            watch(
                () => unref(center),
                (newCenter) => {
                    if (map.value && newCenter) {
                        map.value.setCenter(newCenter);
                    }
                },
            );
        }

        // Watch for zoom changes and update map
        if (zoom) {
            watch(
                () => unref(zoom),
                (newZoom) => {
                    if (map.value && newZoom !== undefined) {
                        map.value.setZoom(newZoom);
                    }
                },
            );
        }
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
        if (!map.value) {
            return console.error('Map is not initialized, cannot add marker');
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
    function flyTo(lngLat: LngLat): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!map.value) {
                const error = new Error('Map is not initialized, cannot fly to location');
                console.error(error.message);
                return reject(error);
            }

            map.value.once('moveend', () => resolve());

            map.value.flyTo({
                center: lngLat,
                zoom: 12,
                duration: 1000,
                essential: true,
            });
        });
    }

    /**
     * Returns the current bounds of the map.
     *
     * @returns - The current bounds of the map as an array of southwest and northeast coordinates.
     */
    function getBounds(): LngLatBounds {
        if (!map.value) {
            console.error('Map is not initialized, cannot get bounds');
            return [
                [0, 0],
                [0, 0],
            ];
        }

        const bounds = map.value.getBounds();

        if (!bounds) {
            console.error('Map bounds are not available');
            return [
                [0, 0],
                [0, 0],
            ];
        }

        return [
            [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
            [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
        ];
    }

    /**
     * Returns the current center of the map.
     *
     * @returns - The current center of the map as a longitude and latitude pair.
     */
    function getCenter(): LngLat {
        if (!map.value) {
            console.error('Map is not initialized, cannot get center');
            return [0, 0];
        }

        const center = map.value.getCenter();

        if (!center) {
            console.error('Map center is not available');
            return [0, 0];
        }

        return [center.lng, center.lat];
    }

    /**
     * Returns the current zoom level of the map.
     *
     * @returns - The current zoom level of the map.
     */
    function getZoom(): number {
        if (!map.value) {
            console.error('Map is not initialized, cannot get zoom level');
            return 0;
        }

        return map.value.getZoom();
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
        getCenter,
        getZoom,
        isLoaded,
        isMoving,
    };
}
