<script lang="ts" setup>
import SlideCarousel from '@/components/molecules/image/SlideCarousel.vue';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { type Location } from '@/domain/location';
import Cluster from './Cluster.vue';
import Marker from './Marker.vue';
import type { ClusterData, LngLat, MapAdapter } from '@/domain/map';

const { map, locations, isLoading, rounded } = defineProps<{
    map: MapAdapter;
    locations?: Location[];
    isLoading?: boolean;
    rounded?: boolean;
}>();

const hoveredLocation = defineModel<Location | null>('hoveredLocation', {
    default: null,
});

const emit = defineEmits<{
    'click:marker': [id: number];
    'click:location': [id: number];
}>();

const { locale } = useI18n();

const clusters = computed<ClusterData[]>(() => map.getClusters?.() || []);

const clusteredMarkerIds = computed(() => {
    const ids = new Set<number>();

    clusters.value.forEach((cluster) => {
        cluster.markers.forEach((markerId) => ids.add(markerId));
    });

    return ids;
});

const visibleLocations = computed(() => {
    if (!locations) {
        return [];
    }

    return locations.filter((location) => {
        return !clusteredMarkerIds.value.has(location.id);
    });
});

const onMarkerClick = (id: number): void => {
    emit('click:marker', id);
};

const onMarkerMouseEnter = (location: Location) => {
    hoveredLocation.value = location;
};

const onMarkerMouseLeave = () => {
    hoveredLocation.value = null;
};

const onClusterClick = (clusterId: string): void => {
    map.zoomToCluster?.(clusterId);
};

// Update clustered markers when locations change or map loads
watch(
    [() => locations, map.isLoaded],
    ([newLocations, loaded]) => {
        if (!map.updateClusteredMarkers || !newLocations || !loaded) {
            return;
        }

        const features = newLocations.map((location: Location) => ({
            id: location.id,
            coord: [location.longitude, location.latitude] as LngLat,
            properties: {
                name: location.name,
            },
        }));

        map.updateClusteredMarkers(features);
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <div ref="mapContainer" class="map" :class="{ 'rounded-lg': rounded }">
        <div v-if="isLoading" class="loader">
            <span>Loading</span>
            <FontAwesomeIcon :icon="faSpinner" spin />
        </div>
        <template v-if="map.isLoaded.value">
            <!-- Render clusters -->
            <Cluster
                v-for="cluster in clusters"
                :key="cluster.id"
                :id="cluster.id"
                :position="cluster.position"
                :count="cluster.count"
                :map="map"
                @click="onClusterClick(cluster.id)">
            </Cluster>

            <!-- Render unclustered markers -->
            <Marker
                v-for="location in visibleLocations"
                :id="location.id"
                :key="location.id"
                :position="[location.longitude, location.latitude]"
                :map="map"
                :location="location"
                :active="location.id === hoveredLocation?.id"
                @click="onMarkerClick(location.id)"
                @mouseenter="onMarkerMouseEnter(location)"
                @mouseleave="onMarkerMouseLeave">
                <template #popover="{ closePopover }">
                    <div class="location-popover" @click="emit('click:location', location.id)">
                        <!-- Carousel for location images -->
                        <div class="location-popover__carousel">
                            <SlideCarousel
                                :items="location.images ?? []"
                                show-navigation-buttons
                                show-dots>
                                <template #default="{ item }">
                                    <img
                                        :src="item.url"
                                        alt="Location Image"
                                        class="location-popover__image" />
                                </template>
                            </SlideCarousel>

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
        </template>
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
