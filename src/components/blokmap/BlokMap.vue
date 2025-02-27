<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { blokmapConfig } from '@/config/blokmapConfig';
import { useLocationService } from '@/composables/services/useLocationService';
import type { Location } from '@/types/model/Location';
import { useDebounceFn } from '@vueuse/core';
import MarkerIcon from '@/assets/img/marker.png';
import L, { type LeafletMouseEvent } from 'leaflet';
import G from 'gsap';
import BlokMapPopover from '@/components/blokmap/BlokMapPopover.vue';

const popoverContainer = ref<InstanceType<typeof BlokMapPopover> | null>(null);
const mapContainer = ref<HTMLElement | null>(null);

const selectedLocation = ref<Location | null>(null);
const selectedMarker = ref<L.Marker | null>(null);
const locationMarkers = new Map<number, L.Marker>();

const { zoom, bounds, maxLocationCount } = blokmapConfig;
const { map } = useLeafletMap(mapContainer);
const { getViewportLocations } = useLocationService();

/**
 * Updates the markers on the map based on the provided locations.
 */
function updateMarkers(locations: Location[]) {
    const newLocationIds = new Set(locations.map((loc) => loc.id));

    // Remove markers not in new response.
    locationMarkers.forEach((marker, id) => {
        const element = marker.getElement();

        if (!element || newLocationIds.has(id)) {
            return;
        }

        G.to(element, {
            duration: 0.3,
            opacity: 0,
            onComplete: () => {
                marker.remove();
                locationMarkers.delete(id);
            },
        });
    });

    // Add new markers in the response.
    locations.forEach((location) => {
        if (locationMarkers.has(location.id)) return;

        const marker = L.marker(location.coords, {
            icon: L.icon({
                iconUrl: MarkerIcon,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            }),
        });

        // Show location details on marker click.
        marker.on('click', (event: LeafletMouseEvent) => {
            if (!map.value) return;

            map.value
                .flyTo(marker.getLatLng(), map.value.getMaxZoom(), {
                    animate: true,
                    duration: 0.5,
                })
                .once('moveend', () => {
                    selectedLocation.value = location;
                    selectedMarker.value = marker;

                    popoverContainer.value?.show(
                        event.originalEvent,
                        marker.getElement(),
                    );
                })
                .once('zoomstart', () => popoverContainer.value?.hide());
        });

        // Animate marker on add.
        marker.once('add', (event: L.LeafletEvent) => {
            const element = event.target.getElement();

            if (element) {
                G.from(element, {
                    duration: 0.3,
                    opacity: 0,
                });
            }
        });

        marker.addTo(map.value!);
        locationMarkers.set(location.id, marker);
    });
}

/**
 * Debounced function to update the locations on the map.
 */
const updateLocations = useDebounceFn(() => {
    if (!map.value) return;

    const locations = getViewportLocations(
        map.value.getBounds(),
        maxLocationCount,
    );

    updateMarkers(locations);
}, 250);

onMounted(() => {
    if (!map.value || !popoverContainer.value) return;

    // Add map configuration.
    // Set the map bounds and zoom level.
    map.value.setMaxBounds(bounds);
    map.value.setZoom(zoom);

    // Add map listeners.
    // map.value.on('update');
    map.value.on('move', popoverContainer.value.update);
    map.value.on('moveend', updateLocations);

    // Update locations on mount.
    updateLocations();
});

onUnmounted(() => {
    if (!map.value) return;

    // Remove map listeners.
    map.value.off('move');
    map.value.off('moveend');
});
</script>

<template>
    <div ref="mapContainer" class="h-full w-full"></div>
    <BlokMapPopover ref="popoverContainer" :location="selectedLocation" />
</template>

<style lang="scss">
@use 'leaflet/dist/leaflet.css';
</style>
