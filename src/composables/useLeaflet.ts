import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type Ref, isRef, onActivated, onMounted, onUnmounted, readonly, ref, watch } from 'vue';
import { defaultMapOptions } from '@/domain/map';
import type { LngLat, LngLatBounds, MapAdapter, MapOptions, Marker } from '@/domain/map';

/**
 * Composable to create a Leaflet map instance with vectorized tiles.
 *
 * @param container - A reference to the HTML element that will contain the map.
 * @param options - Optional configuration options for the map.
 * @returns - An object containing the map instance.
 */
export function useLeaflet<T>(
    container: Ref<HTMLElement | null>,
    options: MapOptions = defaultMapOptions,
): MapAdapter<T> {
    // Merge default options with provided options
    options = {
        ...defaultMapOptions,
        ...options,
    };

    // Bypass deep type inference issues with leaflet types
    // by explicitly casting the correct types.
    const markers = new Map<T, L.Marker>() as Map<T, L.Marker>;
    const map = ref(null) as Ref<L.Map | null>;

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

        const newMap = L.map(container.value, {
            center: [center.value[1], center.value[0]], // Leaflet uses [lat, lng]
            zoom: zoom.value,
            maxBounds: maxBounds.value
                ? [
                      [maxBounds.value[0][1], maxBounds.value[0][0]],
                      [maxBounds.value[1][1], maxBounds.value[1][0]],
                  ]
                : undefined,
            zoomControl: false,
            dragging: options.interactive,
            touchZoom: options.interactive,
            scrollWheelZoom: options.interactive,
            doubleClickZoom: options.interactive,
            boxZoom: options.interactive,
            keyboard: options.interactive,
        });

        // Add vector tile layer using OpenStreetMap
        // You can replace this with other vector tile providers like Mapbox, Maptiler, etc.
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(newMap);

        // Add zoom control in top-right corner
        if (options.interactive) {
            L.control
                .zoom({
                    position: 'topright',
                })
                .addTo(newMap);
        }

        // Listeners //

        newMap.on('move', () => {
            isMoving.value = true;

            const mapCenter = newMap.getCenter();
            const mapBounds = newMap.getBounds();

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

        newMap.on('zoom', () => {
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

        newMap.on('dragstart', () => {
            isDragging.value = true;
        });

        newMap.on('dragend', () => {
            isDragging.value = false;
        });

        // Map loaded event
        newMap.whenReady(() => {
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
            // Add a simple geolocation button
            const GeolocateControl = L.Control.extend({
                options: {
                    position: 'topright',
                },

                onAdd: function () {
                    const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                    const button = L.DomUtil.create('a', 'leaflet-control-geolocate', container);

                    button.innerHTML = '📍';
                    button.href = '#';
                    button.title = 'Find my location';
                    button.style.fontSize = '20px';
                    button.style.lineHeight = '30px';
                    button.style.width = '30px';
                    button.style.height = '30px';
                    button.style.textAlign = 'center';

                    L.DomEvent.on(button, 'click', (e: Event) => {
                        L.DomEvent.preventDefault(e);
                        L.DomEvent.stopPropagation(e);

                        if (navigator.geolocation) {
                            navigator.geolocation.getCurrentPosition(
                                (position) => {
                                    const { longitude, latitude } = position.coords;
                                    newMap.flyTo([latitude, longitude], 17, {
                                        duration: 1.5,
                                    });
                                },
                                (error) => {
                                    console.error('Geolocation error:', error);
                                },
                                {
                                    enableHighAccuracy: true,
                                },
                            );
                        }
                    });

                    return container;
                },
            });

            newMap.addControl(new GeolocateControl());

            if (options.autoGeolocation && navigator.geolocation) {
                newMap.whenReady(() => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const { longitude, latitude } = position.coords;
                            newMap.flyTo([latitude, longitude], 17, {
                                duration: 1.5,
                            });
                        },
                        (error) => {
                            console.error('Auto-geolocation error:', error);
                        },
                        {
                            enableHighAccuracy: true,
                        },
                    );
                });
            }
        }

        map.value = newMap;
    });

    onActivated(() => {
        if (map.value) {
            try {
                map.value?.invalidateSize();
            } catch (error) {
                console.warn('Map resize on activation failed:', error);
            }
        }
    });

    onUnmounted(() => {
        map.value?.remove();
    });

    watch(maxBounds, (newBounds) => {
        if (newBounds && map.value) {
            map.value.setMaxBounds([
                [newBounds[0][1], newBounds[0][0]],
                [newBounds[1][1], newBounds[1][0]],
            ]);
        }
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
                map.value.setView([newCenter[1], newCenter[0]], map.value.getZoom());
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
        const leafletMarker = L.marker([coord[1], coord[0]], {
            icon: L.divIcon({
                html: el,
                className: 'custom-marker',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
            }),
        }).addTo(map.value);

        markers.set(id, leafletMarker);
        markerCount.value = markers.size;
    }

    /**
     * Removes a marker from the map by its identifier.
     *
     * @param id - The identifier of the marker to remove.
     */
    function removeMarker(id: T): void {
        const marker = markers.get(id);
        if (marker) {
            marker.remove();
            markers.delete(id);
            markerCount.value = markers.size;
        }
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

            const leafletBounds = L.latLngBounds(
                [bounds[0][1], bounds[0][0]],
                [bounds[1][1], bounds[1][0]],
            );

            map.value.once('moveend', () => resolve());

            map.value.flyToBounds(leafletBounds, {
                padding: [20, 20],
                duration: 1,
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

            map.value.flyTo([lngLat[1], lngLat[0]], zoom, {
                duration: 2,
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
        bounds,
        isLoaded: readonly(isLoaded),
        isDragging: readonly(isDragging),
        isZooming: readonly(isZooming),
        isMoving: readonly(isMoving),
    };
}
