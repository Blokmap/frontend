import mapboxgl from 'mapbox-gl';
import { type Ref, isRef, onActivated, onMounted, onUnmounted, readonly, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useClustering } from '@/composables/maps/useClustering';
import { useMapBindings } from '@/composables/maps/useMapBindings';
import { DEFAULT_MAP_OPTIONS } from '@/domain/map';
import { isLngLat } from '@/domain/map/mapHelpers';
import type {
    ClusterData,
    ClusteringAdapter,
    LngLat,
    LngLatBounds,
    MapAdapter,
    MapOptions,
    Marker,
    ClusterFeature,
} from '@/domain/map';

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_API_KEY;

/**
 * Composable to create a MapBox map instance.
 *
 * @param container - A reference to the HTML element that will contain the map.
 * @param options - Optional configuration options for the map.
 * @returns An adapter with map methods and state.
 */
export function useMapBox<T>(
    container: Ref<HTMLElement | null>,
    options: MapOptions = DEFAULT_MAP_OPTIONS,
): MapAdapter<T> {
    const { locale } = useI18n();

    options = {
        ...DEFAULT_MAP_OPTIONS,
        ...options,
    };

    const map = ref<any>(null);
    const markers = new Map<T | string, mapboxgl.Marker>();

    // State refs
    const markerCount = ref(0);
    const isLoaded = ref(false);
    const isMoving = ref(false);
    const isZooming = ref(false);
    const isDragging = ref(false);

    // Map property refs - handle MaybeRef options
    const center = isRef(options.center)
        ? options.center
        : ref<LngLat>(options.center || DEFAULT_MAP_OPTIONS.center);

    const zoom = isRef(options.zoom)
        ? options.zoom
        : ref<number>(options.zoom || DEFAULT_MAP_OPTIONS.zoom);

    const maxBounds = isRef(options.maxBounds)
        ? options.maxBounds
        : ref(options.maxBounds || DEFAULT_MAP_OPTIONS.maxBounds);

    const bounds = ref<LngLatBounds>([
        [-180, -90],
        [180, 90],
    ]);

    // Setup two-way bindings
    useMapBindings(map, isLoaded, center, zoom, maxBounds);

    // Initialize clustering if enabled
    const clustering: ClusteringAdapter<T> | null = options.clustering
        ? useClustering<T>(options)
        : null;

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

            // Update clusters when map stops moving
            if (options.clustering && clustering) {
                clustering.updateClusters(bounds.value, map.value?.getZoom() || 0);
            }
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

    /**
     * Adds a marker to the map.
     */
    function addMarker(marker: Marker<T> | Marker<string>): void {
        const mapInstance = map.value;
        if (!mapInstance) {
            console.error('Map is not initialized, cannot add marker');
            return;
        }

        const { id, coord, el } = marker;
        const mbMarker = new mapboxgl.Marker(el).setLngLat(coord).addTo(mapInstance);
        markers.set(id, mbMarker);
        markerCount.value = markers.size;
    }

    /**
     * Removes a marker from the map by its identifier.
     *
     * @param id - The identifier of the marker to remove.
     */
    function removeMarker(id: T | string): void {
        markers.get(id)?.remove();
        markers.delete(id);
        markerCount.value = markers.size;
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
            if (!isLngLat(lngLat)) {
                const error = new Error('Invalid LngLat provided for flyTo: ' + lngLat);
                console.error(error.message);
                return reject(error);
            }

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

    /**
     * Update clustered markers.
     *
     * @param features - Array of features with id, coordinates, and optional properties.
     */
    function updateClusteredMarkers(features: ClusterFeature<T>[]): void {
        if (!map.value) {
            return;
        }

        // If clustering is enabled, use clustering logic
        if (clustering) {
            clustering.loadMarkers(features, bounds.value, map.value.getZoom());
        }
        // Otherwise, just track the markers without clustering
        // (Individual Marker components will call addMarker themselves)
    }

    /**
     * Get current clusters.
     *
     * @returns Array of cluster data.
     */
    function getClusters(): ClusterData[] {
        return clustering?.getClusters() || [];
    }

    /**
     * Zoom into a cluster to expand it.
     *
     * @param clusterId - The cluster ID to zoom into.
     */
    function zoomToCluster(clusterId: string): void {
        if (!clustering) return;

        const expansionZoom = clustering.getExpansionZoom(clusterId);
        const cluster = clustering.getClusters().find((c) => c.id === clusterId);

        if (cluster && expansionZoom) {
            flyTo(cluster.position, expansionZoom);
        }
    }

    return {
        addMarker,
        removeMarker,
        flyToBounds,
        flyTo,
        updateClusteredMarkers: options.clustering ? updateClusteredMarkers : undefined,
        getClusters: options.clustering ? getClusters : undefined,
        zoomToCluster: options.clustering ? zoomToCluster : undefined,
        center,
        zoom,
        bounds: bounds,
        isLoaded: readonly(isLoaded),
        isDragging: readonly(isDragging),
        isZooming: readonly(isZooming),
        isMoving: readonly(isMoving),
    };
}
