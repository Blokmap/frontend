<script lang="ts" setup>
import Marker from './Marker.vue';
import { useMapBox } from '@/composables/useMapBox';
import type { LngLatBounds, MapOptions } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { faBuildingColumns, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useLocalStorage } from '@vueuse/core';
import { useTemplateRef, watch } from 'vue';

defineProps<{
    locations?: Location[];
    isLoading?: boolean;
}>();

const bounds = defineModel<LngLatBounds | null>('bounds', {
    default: () => ({
        northEast: { lat: 0, lng: 0 },
        southWest: { lat: 0, lng: 0 },
    }),
});

const hoveredLocation = defineModel<Location | null>('hoveredLocation', {
    default: null,
});

const emit = defineEmits<{
    (e: 'click:marker', id: number): void;
}>();

const mapContainerRef = useTemplateRef('mapContainer');
const config = useLocalStorage<MapOptions>('map', {});
const map = useMapBox(mapContainerRef, config.value);

function handleMarkerClick(id: number): void {
    emit('click:marker', id);
}

function handleMarkerMouseEnter(location: Location) {
    hoveredLocation.value = location;
}

function handleMarkerMouseLeave() {
    hoveredLocation.value = null;
}

watch(
    map.bounds,
    (newBounds) => {
        bounds.value = newBounds;
        config.value.center = map.center.value;
        config.value.zoom = map.zoom.value;
    },
    { deep: true, immediate: true },
);

defineExpose({ map });
</script>

<template>
    <div ref="mapContainer" class="map">
        <div class="loader" v-if="isLoading">
            <span>Loading</span>
            <FontAwesomeIcon :icon="faSpinner" spin />
        </div>
        <slot v-if="map.isLoaded.value">
            <Marker
                v-for="location in locations"
                :key="location.id"
                :id="location.id"
                :position="[location.longitude, location.latitude]"
                :map="map"
                :active="location.id === hoveredLocation?.id"
                @mouseenter="handleMarkerMouseEnter(location)"
                @mouseleave="handleMarkerMouseLeave"
                @click="handleMarkerClick(location.id)">
                <template #popover>
                    <div class="flex items-center gap-1">
                        <FontAwesomeIcon :icon="faBuildingColumns" />
                        <p class="font-bold">
                            {{ location.name }}
                        </p>
                    </div>
                    <div class="my-2">
                        <p>{{ location.street }} {{ location.number }}</p>
                        <p>{{ location.zip }} {{ location.city }}</p>
                    </div>
                </template>
            </Marker>
        </slot>
    </div>
</template>

<style lang="css">
@reference '@/assets/styles/main.css';
@import '@/assets/styles/maps.css';

.map {
    @apply relative z-2 h-full overflow-hidden rounded-xl border-2 border-slate-200;

    .loader {
        @apply absolute top-4 left-1/2 z-50 -translate-x-1/2 transform;
        @apply rounded-full bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-md;
        @apply flex items-center justify-center gap-2;
    }
}
</style>
