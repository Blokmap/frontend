<script setup lang="ts">
import { useMapBox } from '@/composables/useMapBox';
import type { LngLat, LngLatBounds } from '@/types/contract/Map';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';

const center = defineModel<LngLat>('center', {
    default: () => [4.3517, 50.8503],
});

const props = withDefaults(
    defineProps<{
        zoom?: number;
        padding?: number;
    }>(),
    {
        zoom: 16,
        padding: 0.0025,
    },
);

const mapContainerRef = useTemplateRef('mapContainer');

const map = useMapBox(mapContainerRef, {
    center: center,
    zoom: props.zoom,
});
</script>

<template>
    <div ref="mapContainer" class="map relative h-full w-full rounded-lg">
        <FontAwesomeIcon class="crosshair" :icon="faLocationDot" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.crosshair {
    @apply absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform;
    @apply pointer-events-none text-3xl;
}
</style>
