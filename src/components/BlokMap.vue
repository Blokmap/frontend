<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { blokmapConfig } from '@/config/blokmapConfig';
import { useLocationService } from '@/composables/services/useLocationService';
import type { Location } from '@/types/model/Location';
import { useDebounceFn } from '@vueuse/core';
import { Button, Popover, Tag } from 'primevue';
import { PrimeIcons } from '@primevue/core';
import MarkerIcon from '@/assets/img/marker.png';
import L, { type LeafletMouseEvent } from 'leaflet';
import G from 'gsap';

const mapContainer = ref<HTMLElement | null>(null);
const popoverContainer = ref<InstanceType<typeof Popover> | null>(null);
const popoverShown = ref(false);

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
            selectedLocation.value = location;
            selectedMarker.value = marker;

            map.value
                ?.flyTo(marker.getLatLng(), map.value.getMaxZoom(), {
                    animate: true,
                    duration: 0.5,
                })
                .once('moveend', () => {
                    popoverContainer.value?.show(
                        event.originalEvent,
                        marker.getElement(),
                    );
                });
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
 * Updates the popover overlay position.
 */
function updatePopover() {
    if (!selectedLocation.value) return;

    try {
        popoverContainer.value?.alignOverlay();
    } catch {
        console.warn('Failed to align popover overlay.');
    }
}

/**
 * Hides the popover overlay.
 */
function hidePopover() {
    popoverContainer.value?.hide();
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
    if (!map.value) return;

    // Add map configuration.
    // Set the map bounds and zoom level.
    map.value.setMaxBounds(bounds);
    map.value.setZoom(zoom);

    // Add map listeners.
    // map.value.on('update');
    map.value.on('move', updatePopover);
    map.value.on('zoomanim', updatePopover);
    map.value.on('dragstart', hidePopover);
    map.value.on('moveend', updateLocations);

    // Update locations on mount.
    updateLocations();
});

onUnmounted(() => {
    if (!map.value) return;

    // Remove map listeners.
    map.value.off('move');
    map.value.off('moveend');
    map.value.off('zoomanim');
    map.value.off('dragstart');
});
</script>

<template>
    <div ref="mapContainer" class="h-full w-full"></div>
    <Popover
        ref="popoverContainer"
        class="w-30rem max-w-full"
        @hide="popoverShown = false"
        @show="popoverShown = true">
        <template v-if="selectedLocation !== null">
            <h2 class="m-0">{{ selectedLocation.name }}</h2>
            <div class="flex gap-2 my-3">
                <Tag :icon="PrimeIcons.STAR" severity="contrast"> Popular </Tag>
                <Tag :icon="PrimeIcons.CALENDAR" severity="secondary">
                    Event
                </Tag>
                <Tag :icon="PrimeIcons.BOLT" severity="secondary"> Coffee </Tag>
            </div>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum
                possimus vitae culpa minus iste non inventore, sint accusantium
                nostrum ipsum, maiores laudantium! Adipisci omnis officiis velit
                quia repudiandae alias soluta!
            </p>
            <Button
                label="More information"
                severity="contrast"
                icon-pos="right"
                :icon="PrimeIcons.ARROW_RIGHT"
                outlined>
            </Button>
        </template>
    </Popover>
</template>

<style lang="scss">
@use 'leaflet/dist/leaflet.css';
</style>
