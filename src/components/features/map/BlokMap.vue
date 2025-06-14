<script lang="ts" setup>
import { useMapBox } from '@/composables/useMapBox';
import type { LngLatBounds } from '@/types/contract/Map';
import type { SearchedLocation } from '@/types/schema/Location';
import { onMounted, useTemplateRef, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        locations?: SearchedLocation[];
        isLoading?: boolean;
        rounded?: boolean;
        shadow?: boolean;
    }>(),
    {
        rounded: true,
        shadow: false,
    },
);

const emit = defineEmits<{
    (e: 'change:bounds', value: LngLatBounds): void;
}>();

const mapContainer = useTemplateRef('mapContainer');
const map = useMapBox(mapContainer);

onMounted(() => {
    map.setOnBoundsChange((bounds) => {
        emit('change:bounds', bounds);
    });
});

watch(map.isLoaded, updateMarkers);
watch(() => props.locations, updateMarkers);

/**
 * Updates the markers on the map based on the new and old locations.
 *
 * @returns void
 */
function updateMarkers(): void {
    const locations = props.locations || [];
    map.setMarkers(
        locations.map((location: SearchedLocation) => [
            location.id,
            [location.longitude, location.latitude],
        ]),
    );
}
</script>

<template>
    <div ref="mapContainer" class="h-full relative border-2 border-slate-200" />
</template>

<style lang="css">
@import '@/assets/styles/maps.css';
</style>
