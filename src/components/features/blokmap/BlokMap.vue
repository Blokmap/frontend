<script lang="ts" setup>
import MarkerIcon from '@/assets/img/map/home.png';
import BlokMapPopover from '@/components/features/blokmap/BlokMapPopover.vue';
import { useLeafletMap } from '@/composables/useLeafletMap';
import { blokmapConfig } from '@/config/blokmap';
import { BlokMapMarker } from '@/types/Leaflet';
import type { SearchedLocation } from '@/types/schema/Location';
import { faLocation, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useGeolocation } from '@vueuse/core';
import G from 'gsap';
import L, { type LeafletMouseEvent } from 'leaflet';
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        locations?: SearchedLocation[];
        isLoading?: boolean;
        rounded?: boolean;
        shadow?: boolean;
    }>(),
    {
        rounded: true,
        shadow: false,
    },
);

const selectedLocation = defineModel<SearchedLocation | null>('location', {
    default: null,
});

const geolocation = useGeolocation();
const popoverContainer = useTemplateRef('popover');
const mapContainer = useTemplateRef('blokmap');

const { map, markers } = useLeafletMap(mapContainer);
const { zoom, bounds } = blokmapConfig;

watch(
    () => props.locations,
    (newLocations, oldLocations) => {
        if (!!newLocations) {
            updateMarkers(newLocations, oldLocations);
        }
    },
    { immediate: true },
);

onMounted(() => {
    map.value?.setMaxBounds(bounds);
    map.value?.setZoom(zoom);

    if (popoverContainer.value) {
        map.value?.on('move', popoverContainer.value.update);
        map.value?.on('dragend', popoverContainer.value.hide);
    }
});

onUnmounted(() => {
    map.value?.off('move');
    map.value?.off('dragend');
});

/**
 * Updates the markers on the map based on the provided locations.
 *
 * @param {SearchedLocation[]} locations - The new locations to display on the map.
 * @returns {void}
 */
function updateMarkers(
    newLocations?: SearchedLocation[] | null,
    oldLocations?: SearchedLocation[] | null,
): void {
    const oldIds = new Set(oldLocations?.map((l) => l.id) || []);
    const newIds = new Set(newLocations?.map((l) => l.id) || []);

    // Remove markers not in new response.
    markers.getLayers().forEach((m: unknown) => {
        const marker = m as BlokMapMarker;

        if (!newIds.has(marker.location.id)) {
            const element = marker.getElement();

            if (!element || newIds.has(marker.location.id)) {
                oldIds.add(marker.location.id);
            } else {
                G.to(element, {
                    duration: 0.3,
                    opacity: 0,
                    onComplete: () => {
                        markers.removeLayer(marker);
                    },
                });
            }
        }
    });

    // Add new markers in the response.
    newLocations?.forEach((location: SearchedLocation) => {
        // Skip if the location already exists.
        if (oldIds.has(location.id)) return;

        const marker = new BlokMapMarker(location, {
            icon: L.icon({
                iconUrl: MarkerIcon,
                iconSize: [35, 35],
                iconAnchor: [17.5, 35],
            }),
        });

        // Show location details on marker click.
        marker.on('click', (event: LeafletMouseEvent) => {
            const currentMap = map.value;
            const distance = currentMap?.getCenter().distanceTo(marker.getLatLng());
            currentMap
                ?.flyTo(marker.getLatLng(), currentMap.getMaxZoom(), {
                    animate: true,
                    duration: distance && distance < 10 ? 0 : 1,
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

/**
 * Centers the map on the user's current location.
 */
function handleCenterClick(): void {
    if (!map.value) return;
    map.value.locate({ setView: true, maxZoom: 16 });
}

defineExpose({ map });
</script>

<template>
    <div
        ref="blokmap"
        class="h-full relative border-2 border-slate-100"
        :class="{ 'rounded-xl': rounded, 'shadow-md': shadow }">
        <BlokMapPopover
            ref="popover"
            :selected-location="selectedLocation"
            :is-favorite-location="false">
        </BlokMapPopover>
        <div class="absolute bottom-4 right-3 z-401 flex flex-col gap-2">
            <!-- Zoom Controls Group -->
            <div
                class="flex flex-col bg-white rounded-full shadow-md overflow-hidden border border-slate-200">
                <button
                    class="p-2 hover:bg-gray-100 transition"
                    @click="map?.zoomIn()"
                    title="Zoom in">
                    <FontAwesomeIcon :icon="faPlus" />
                </button>
                <button
                    class="p-2 hover:bg-gray-100 transition"
                    @click="map?.zoomOut()"
                    title="Zoom out">
                    <FontAwesomeIcon :icon="faMinus" />
                </button>
            </div>

            <!-- Center Button -->
            <button
                class="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition border border-slate-200"
                @click="handleCenterClick"
                title="Center to current location">
                <FontAwesomeIcon :icon="faLocation" />
            </button>
        </div>
    </div>
</template>

<style lang="css">
@import 'leaflet/dist/leaflet.css';
</style>
