<script lang="ts" setup>
import { onMounted } from 'vue';
import { useBlokmap } from '@/composables/blokmap.comp';
import { useLocation } from '@/composables/location.comp';

const { getGeoLocation } = useLocation();

onMounted(() => {
    getGeoLocation();
    useBlokmap();
});
</script>

<template>
    <div id="map" class="h-screen w-screen"></div>
</template>

<style lang="scss">
@use 'leaflet/dist/leaflet.css';
</style>
