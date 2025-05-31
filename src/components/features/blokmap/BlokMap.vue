<script lang="ts" setup>
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { blokmapConfig } from '@/config/blokmap';
import type { Location } from '@/types/model/Location';
import { BlokMapMarker } from '@/types/Leaflet';
import BlokMapPopover from '@/components/features/blokmap/BlokMapPopover.vue';
import MarkerIcon from '@/assets/img/map/home.png';
import L, { type LeafletMouseEvent } from 'leaflet';
import G from 'gsap';

const { locations } = withDefaults(
    defineProps<{
        locations: Location[];
        rounded?: boolean;
    }>(),
    {
        rounded: true,
    },
);

const emit = defineEmits<{
    'toggle:favorite': (location: Location) => void;
    'update:location': (location: Location | null) => void;
}>();

const selectedLocation = defineModel<Location | null>('location', {
    required: true,
});

const { zoom, bounds } = blokmapConfig;
const popoverContainer = useTemplateRef('popover');
const mapContainer = useTemplateRef('blokmap');
const { map, markers } = useLeafletMap(mapContainer);

watch(
    () => locations,
    (newLocations) => {
        updateMarkers(newLocations);
    },
);

onMounted(() => {
    if (!map.value || !popoverContainer.value) return;

    map.value.setMaxBounds(bounds);
    map.value.setZoom(zoom);

    const { update, hide } = popoverContainer.value;
    map.value.on('move', update);
    map.value.on('dragend', hide);
});

onUnmounted(() => {
    if (!map.value) return;
    map.value.off('move');
    map.value.off('dragend');
});

defineExpose({ map });

/**
 * Updates the markers on the map based on the provided locations.
 */
function updateMarkers(locs: Location[] = locations): void {
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
    locs.forEach((location) => {
        if (existingLocationIds.has(location.id)) return;

        const marker = new BlokMapMarker(location, {
            icon: L.icon({
                iconUrl: MarkerIcon,
                iconSize: [35, 35],
                iconAnchor: [17.5, 35],
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
                    popoverContainer.value?.show(event.originalEvent, marker.getElement());
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
</script>

<template>
    <div ref="blokmap" :class="{ 'h-full': true, 'rounded-xl': rounded }">
        <BlokMapPopover
            ref="popover"
            id="popover"
            :selected-location="selectedLocation"
            :is-favorite-location="false">
        </BlokMapPopover>
    </div>
</template>

<style lang="css">
@import 'leaflet/dist/leaflet.css';
</style>
