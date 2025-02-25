<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useBlokmap } from '@/composables/blokmap.comp';

const mapContainer = ref<HTMLElement | null>(null);

onMounted(() => {
    if (mapContainer.value) {
        useBlokmap(mapContainer.value);
    }
});
</script>

<template>
    <div ref="mapContainer" class="h-screen w-screen"></div>
</template>

<style lang="scss">
@use 'leaflet/dist/leaflet.css';
</style>
