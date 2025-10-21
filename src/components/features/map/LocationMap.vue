<script setup lang="ts">
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';
import { useMapBox } from '@/composables/maps/useMapBox';
import type { LngLat } from '@/domain/map';

const props = withDefaults(
    defineProps<{
        interactive?: boolean;
        geoLocationControl?: boolean;
        autoGeolocation?: boolean;
    }>(),
    {
        interactive: true,
        geoLocationControl: true,
        autoGeolocation: false,
    },
);

const center = defineModel<LngLat>('center', {
    default: () => [4.3517, 50.8503],
});

const zoom = defineModel<number>('zoom', {
    default: 18,
});

const mapContainer = useTemplateRef('mapContainer');

useMapBox(mapContainer, {
    center,
    zoom,
    geoLocationControl: props.geoLocationControl,
    interactive: props.interactive,
    autoGeolocation: props.autoGeolocation,
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
    @apply pointer-events-none text-4xl;
}
</style>
