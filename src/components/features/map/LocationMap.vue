<script setup lang="ts">
import { useMapBox } from '@/composables/useMapBox';
import type { Location } from '@/domain/location';
import type { LngLat } from '@/types/Map';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';

const props = defineProps<{
    location: Location;
}>();

const mapCenter = computed((): LngLat => [props.location.longitude, props.location.latitude]);

useMapBox(useTemplateRef('mapContainer'), {
    center: mapCenter.value,
    zoom: 16,
    geoLocationControl: false,
});
</script>

<template>
    <div ref="mapContainer" class="static-map map h-full w-full">
        <!-- Static marker pin -->
        <div class="marker-pin">
            <FontAwesomeIcon :icon="faLocationDot" class="text-3xl text-red-600 drop-shadow-lg" />
        </div>
        <!-- Overlay to disable interactions -->
        <div class="interaction-overlay"></div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.static-map {
    pointer-events: none;
}

.marker-pin {
    @apply absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform;
    @apply pointer-events-none;
}

.interaction-overlay {
    @apply absolute inset-0 z-10;
    @apply pointer-events-none;
}
</style>
