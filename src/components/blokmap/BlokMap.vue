<script lang="ts" setup>
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { blokmapConfig } from '@/config/blokmapConfig';
import type { Location } from '@/types/model/Location';
import { BlokMapMarker } from '@/types/Leaflet';
import MarkerIcon from '@/assets/img/home.png';
import L, { type LeafletMouseEvent } from 'leaflet';
import G from 'gsap';
import BlokMapPopover from '@/components/blokmap/BlokMapPopover.vue';

const props = defineProps<{
    locations: Location[];
}>();

const selectedLocation = defineModel<Location | null>('location', {
    required: true,
});

const popoverContainer = useTemplateRef('popover');
const mapContainer = useTemplateRef('blokmap');

const { zoom, bounds } = blokmapConfig;
const { map, markers } = useLeafletMap(mapContainer);

/**
 * Updates the markers on the map based on the provided locations.
 */
function updateMarkers(locations: Location[] = props.locations): void {
    const locationIds = new Set(locations.map((loc) => loc.id));
    const existingLocationIds = new Set();

    // Remove markers not in new response.
    markers.getLayers().forEach((m: unknown) => {
        const marker = m as BlokMapMarker;
        const element = marker.getElement();

        if (!element || locationIds.has(marker.location.id)) {
            existingLocationIds.add(marker.location.id);
            return;
        }

        G.to(element, {
            duration: 0.3,
            opacity: 0,
            onComplete: () => {
                markers.removeLayer(marker);
            },
        });
    });

    // Add new markers in the response.
    locations.forEach((location) => {
        if (existingLocationIds.has(location.id)) return;

        const marker = new BlokMapMarker(location, {
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

        marker.addTo(markers);
    });
}

watch(() => props.locations, updateMarkers);

onMounted(() => {
    if (!map.value || !popoverContainer.value) return;

    // Add map configuration.
    // Set the map bounds and zoom level.
    map.value.setMaxBounds(bounds);
    map.value.setZoom(zoom);

    // Add map listeners.
    const { update } = popoverContainer.value;
    map.value.on('move', update);
});

onUnmounted(() => {
    if (!map.value) return;

    // Remove map listeners.
    map.value.off('move');
});

defineExpose({
    map,
});
</script>

<template>
    <div ref="blokmap">
        <BlokMapPopover ref="popover" :location="selectedLocation" />
    </div>
</template>

<style lang="scss">
@use 'leaflet/dist/leaflet.css';
</style>
