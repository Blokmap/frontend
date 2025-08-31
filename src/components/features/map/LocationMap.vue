<script setup lang="ts">
import { useMapBox } from '@/composables/useMapBox';
import type { Location } from '@/domain/location';
import type { LngLat } from '@/domain/map';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';

const props = defineProps<{
    location: Location;
}>();

const mapContainer = useTemplateRef('mapContainer');
const mapCenter = computed((): LngLat => [props.location.longitude, props.location.latitude]);

useMapBox(mapContainer, {
    center: mapCenter.value,
    zoom: 17,
    geoLocationControl: false,
    interactive: false,
});
</script>

<template>
    <div ref="mapContainer" class="map w-full">
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
