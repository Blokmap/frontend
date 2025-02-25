<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useLeafletMap } from '@/composables/leaflet.comp';
import { blokmapConfig } from '@/config/blokmap.config';

const container = ref<HTMLElement | null>(null);

const { zoom, bounds } = blokmapConfig;
const { map } = useLeafletMap(container);

onMounted(() => {
    if (map.value) {
        map.value.setMaxBounds(bounds);
        map.value.setZoom(zoom);
    }
});
</script>

<template>
    <div ref="container" class="h-full w-full"></div>
</template>

<style lang="scss">
@use 'leaflet/dist/leaflet.css';
</style>
