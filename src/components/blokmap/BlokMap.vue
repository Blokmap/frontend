<script lang="ts" setup>
import { computed, onMounted, onUnmounted, useTemplateRef, watch } from 'vue';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { blokmapConfig } from '@/config/blokmapConfig';
import type { Location, LocationId } from '@/types/model/Location';
import { BlokMapMarker } from '@/types/Leaflet';
import MarkerIcon from '@/assets/img/home.png';
import L, { type LeafletMouseEvent } from 'leaflet';
import G from 'gsap';
import BlokMapPopover from '@/components/blokmap/BlokMapPopover.vue';

const { favoriteLocations, loadedLocations } = defineProps<{
    loadedLocations: Location[];
    favoriteLocations?: LocationId[];
}>();

const selectedLocation = defineModel<Location | null>('location', {
    required: true,
});

const selectedIsFavorite = computed(() => {
    if (!favoriteLocations || !selectedLocation.value) return false;
    return favoriteLocations.includes(selectedLocation.value.id);
});

const emit = defineEmits(['toggle:favorite']);

const popoverContainer = useTemplateRef('popover');
const mapContainer = useTemplateRef('blokmap');

const { zoom, bounds } = blokmapConfig;
const { map, markers } = useLeafletMap(mapContainer);

/**
 * Updates the markers on the map based on the provided locations.
 */
function updateMarkers(locations: Location[] = loadedLocations): void {
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

watch(() => loadedLocations, updateMarkers);

onMounted(() => {
    if (!map.value || !popoverContainer.value) return;

    // Add map configuration.
    // Set the map bounds and zoom level.
    map.value.setMaxBounds(bounds);
    map.value.setZoom(zoom);

    // Add map listeners.
    const { update, hide } = popoverContainer.value;
    map.value.on('move', update);
    map.value.on('dragend', hide);
});

onUnmounted(() => {
    if (!map.value) return;

    // Remove map listeners.
    map.value.off('move');
    map.value.off('dragend');
});

defineExpose({
    map,
});
</script>

<template>
    <div ref="blokmap">
        <BlokMapPopover
            ref="popover"
            :selected-location="selectedLocation"
            :is-favorite-location="selectedIsFavorite"
            @toggle:favorite="emit('toggle:favorite', $event)">
        </BlokMapPopover>
    </div>
</template>

<style lang="scss">
@use 'leaflet/dist/leaflet.css';
</style>
