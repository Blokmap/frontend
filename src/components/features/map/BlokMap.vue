<script lang="ts" setup>
import Carousel from '@/components/shared/molecules/Carousel.vue';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useGeolocation } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { type Location } from '@/domain/location';
import Cluster from './Cluster.vue';
import Marker from './Marker.vue';
import type { LngLat, MapAdapter } from '@/domain/map';

const props = defineProps<{
    map: MapAdapter;
    locations?: Location[];
    isLoading?: boolean;
}>();

const hoveredLocation = defineModel<Location | null>('hoveredLocation', {
    default: null,
});

const emit = defineEmits<{
    (e: 'click:marker', id: number): void;
}>();

const { locale } = useI18n();
const { coords } = useGeolocation();

const router = useRouter();

// Track whether we have flown to the user's location.
const hasFlownToUserLocation = ref<boolean>(false);

// Track clusters
const clusters = computed(() => props.map.getClusters?.() || []);

// Get the set of marker IDs that are currently in clusters
const clusteredMarkerIds = computed(() => {
    const ids = new Set<number>();

    clusters.value.forEach((cluster) => {
        cluster.markers.forEach((markerId) => ids.add(markerId));
    });

    return ids;
});

// Filter locations to show only unclustered markers
const visibleLocations = computed(() => {
    if (!props.locations) return [];
    return props.locations.filter((location) => !clusteredMarkerIds.value.has(location.id));
});

function onMarkerClick(id: number): void {
    emit('click:marker', id);
}

function onMarkerMouseEnter(location: Location) {
    hoveredLocation.value = location;
}

function onMarkerMouseLeave() {
    hoveredLocation.value = null;
}

function navigateToDetail(locationId: number): void {
    router.push({ name: 'locations.detail', params: { locationId } });
}

function onClusterClick(clusterId: string): void {
    props.map.zoomToCluster?.(clusterId);
}

// Update clustered markers when locations change or map loads
watch(
    [() => props.locations, () => props.map.isLoaded.value],
    ([newLocations, loaded]) => {
        if (props.map.updateClusteredMarkers && newLocations && loaded) {
            const features = newLocations.map((location: Location) => ({
                id: location.id,
                coord: [location.longitude, location.latitude] as LngLat,
                properties: {
                    name: location.name,
                },
            }));
            props.map.updateClusteredMarkers(features);
        }
    },
    { immediate: true, deep: true },
);

// Fly to user's geolocation when available
watch([props.map.isLoaded, coords], async ([isLoaded, coords]) => {
    if (isLoaded && coords && !hasFlownToUserLocation.value) {
        props.map.flyTo([coords.longitude, coords.latitude], 15);
        hasFlownToUserLocation.value = true;
    }
});

const mapContainer = useTemplateRef('mapContainer');
defineExpose({ mapContainer });
</script>

<template>
    <div ref="mapContainer" class="map">
        <div v-if="isLoading" class="loader">
            <span>Loading</span>
            <FontAwesomeIcon :icon="faSpinner" spin />
        </div>
        <slot v-if="props.map.isLoaded.value">
            <!-- Render clusters -->
            <Cluster
                v-for="cluster in clusters"
                :key="cluster.id"
                :id="cluster.id"
                :position="cluster.position"
                :count="cluster.count"
                :map="props.map"
                @click="onClusterClick(cluster.id)">
            </Cluster>

            <!-- Render unclustered markers -->
            <Marker
                v-for="location in visibleLocations"
                :id="location.id"
                :key="location.id"
                :position="[location.longitude, location.latitude]"
                :map="props.map"
                :location="location"
                :active="location.id === hoveredLocation?.id"
                @click="onMarkerClick(location.id)"
                @mouseenter="onMarkerMouseEnter(location)"
                @mouseleave="onMarkerMouseLeave">
                <template #popover="{ closePopover }">
                    <div class="location-popover" @click="navigateToDetail(location.id)">
                        <!-- Carousel for location images -->
                        <div class="location-popover__carousel">
                            <Carousel
                                :items="location.images ?? []"
                                show-navigation-buttons
                                show-dots>
                                <template #default="{ item }">
                                    <img
                                        :src="item.url"
                                        alt="Location Image"
                                        class="location-popover__image" />
                                </template>
                            </Carousel>

                            <!-- Close button overlayed on carousel -->
                            <button
                                type="button"
                                class="location-popover__close"
                                @click.stop="closePopover"
                                aria-label="Close">
                                <FontAwesomeIcon :icon="faTimes" />
                            </button>
                        </div>

                        <!-- Location details -->
                        <div class="location-popover__details">
                            <h3 class="location-popover__name">
                                {{ location.name }}
                            </h3>
                            <p class="location-popover__excerpt">
                                {{ location.excerpt[locale] }}
                            </p>
                            <p class="location-popover__address">
                                {{ location.street }} {{ location.number }}, {{ location.zip }}
                                {{ location.city }}
                            </p>
                        </div>
                    </div>
                </template>
            </Marker>
        </slot>
    </div>
</template>

<style lang="css" scoped>
@reference '@/assets/styles/main.css';

.loader {
    @apply absolute top-4 left-1/2 z-50 -translate-x-1/2 transform;
    @apply rounded bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-md;
    @apply flex items-center justify-center gap-2;
}

.location-popover {
    @apply w-[300px] cursor-pointer;
}

.location-popover__carousel {
    @apply relative w-full;
}

.location-popover__image {
    @apply h-full max-h-[175px] w-full object-cover;
}

.location-popover__close {
    @apply absolute top-3 right-3 z-20;
    @apply flex h-8 w-8 items-center justify-center;
    @apply rounded-full bg-white/90 text-gray-800 shadow-md transition-all hover:scale-110 hover:bg-white;
}

.location-popover__details {
    @apply space-y-1.5 px-4 py-3;
}

.location-popover__name {
    @apply text-lg font-semibold text-gray-900;
}

.location-popover__excerpt {
    @apply text-sm text-gray-600;
}

.location-popover__address {
    @apply text-sm text-gray-500;
}
</style>
