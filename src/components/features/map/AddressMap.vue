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
        boundsPadding?: number;
    }>(),
    {
        zoom: 16,
        boundsPadding: 0.0025,
    },
);

const bounds = computed<LngLatBounds>(() => {
    const [lng, lat] = center.value;
    const padding = props.boundsPadding;

    return [
        [lng - padding, lat - padding],
        [lng + padding, lat + padding],
    ];
});

const mapContainerRef = useTemplateRef('mapContainer');

// Pass the reactive center ref directly to useMapBox
// This creates automatic two-way binding without manual synchronization
const map = useMapBox(mapContainerRef, {
    center: center, // Pass the reactive ref directly
    zoom: props.zoom,
    bounds: bounds.value,
});

defineExpose({ map });
</script>

<template>
    <div class="relative h-full w-full">
        <div ref="mapContainer" class="map rounded-lg"></div>
        <FontAwesomeIcon class="crosshair text-xl" :icon="faLocationDot" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
@import '@/assets/styles/maps.css';

.map {
    @apply h-full w-full;
}

.crosshair {
    @apply pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform;
}
</style>
