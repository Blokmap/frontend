<script setup lang="ts">
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';

import { useMapBox } from '@/composables/useMapBox';

import type { LngLat } from '@/domain/map';

const center = defineModel<LngLat>('center', {
    default: () => [4.3517, 50.8503],
});

const zoom = defineModel<number>('zoom', {
    default: 18,
});

withDefaults(
    defineProps<{
        padding?: number;
    }>(),
    {
        padding: 0.0025,
    },
);

useMapBox(useTemplateRef('mapContainer'), {
    center,
    zoom,
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
