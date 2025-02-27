<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useLeafletMap } from '@/composables/leaflet.comp';
import { blokmapConfig } from '@/config/blokmap.config';
import { useLocationService } from '@/composables/services/location.service';
import type { Location } from '@/types/model/Location';
import { useDebounceFn } from '@vueuse/core';
import MarkerIcon from '@/assets/img/marker.png';
import L from 'leaflet';
import gsap from 'gsap';
import Dialog from 'primevue/dialog';

const container = ref<HTMLElement | null>(null);

const { zoom, bounds, maxLocationCount } = blokmapConfig;
const { map } = useLeafletMap(container);
const { getViewportLocations } = useLocationService();

const locationMarkers = new Map<number, L.Marker>();
const selectedLocation = ref<Location | null>(null);

/**
 * Updates the markers on the map based on the provided locations.
 */
function updateMarkers(locations: Location[]) {
    if (!map.value) return;

    const newLocationIds = new Set(locations.map((loc) => loc.id));

    // Remove markers not in new response.
    locationMarkers.forEach((marker, id) => {
        if (!newLocationIds.has(id)) {
            const element = marker.getElement();
            if (element) {
                gsap.to(element, {
                    duration: 0.3,
                    opacity: 0,
                    onComplete: () => {
                        marker.remove();
                        locationMarkers.delete(id);
                    },
                });
            }
        }
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

        marker.on('click', () => {
            selectedLocation.value = location;
        });

        marker.once('add', (event: L.LeafletEvent) => {
            const element = event.target.getElement();

            if (element) {
                gsap.from(element, {
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
    if (map.value) {
        const locations = getViewportLocations(
            map.value.getBounds(),
            map.value.getZoom(),
            maxLocationCount,
        );
        updateMarkers(locations);
    }
}, 100);

onMounted(() => {
    if (map.value) {
        map.value.setMaxBounds(bounds);
        map.value.setZoom(zoom);
        map.value.addEventListener('moveend', updateLocations);
        updateLocations();
    }
});

onUnmounted(() => {
    if (map.value) {
        map.value.removeEventListener('move', updateLocations);
    }
});
</script>

<template>
    <div ref="container" class="h-full w-full"></div>
    <Dialog
        :visible="selectedLocation !== null"
        modal
        header="Location Details"
        :style="{ width: '50vw' }"
        @update:visible="selectedLocation = null"
    >
        <div v-if="selectedLocation">
            <h3 class="text-xl font-bold mb-4">{{ selectedLocation.name }}</h3>
            <p>Latitude: {{ selectedLocation.coords.lat.toFixed(4) }}</p>
            <p>Longitude: {{ selectedLocation.coords.lng.toFixed(4) }}</p>
        </div>
    </Dialog>
</template>

<style lang="scss">
@use 'leaflet/dist/leaflet.css';
</style>
