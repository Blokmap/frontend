<script setup lang="ts">
import { useMapBox } from '@/composables/useMapBox';
import type { LngLat } from '@/types/contract/Map';
import { faLocationCrosshairs } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';

const center = defineModel<LngLat>('center', {
    default: () => [4.3517, 50.8503], // Brussels default
});

const props = withDefaults(
    defineProps<{
        zoom?: number;
    }>(),
    {
        zoom: 16,
    },
);

const mapContainerRef = useTemplateRef('mapContainer');
const map = useMapBox(mapContainerRef, {}, center, props.zoom);

defineExpose({ map });
</script>

<template>
    <div class="relative h-full w-full">
        <div ref="mapContainer" class="map" />

        <!-- Center crosshair marker -->
        <div class="crosshair">
            <FontAwesomeIcon :icon="faLocationCrosshairs" class="crosshair-icon" />
        </div>
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

.crosshair-icon {
    @apply text-secondary-600 text-2xl drop-shadow-lg;
}
</style>
