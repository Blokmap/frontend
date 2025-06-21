<script lang="ts" setup>
import { useMapBox } from '@/composables/useMapBox';
import type { LngLatBounds } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { onMounted, useTemplateRef, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        locations?: Location[];
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
    if (!props.isLoading) {
        map.setMarkers(
            locations.map((location: Location) => [
                location.id,
                [location.longitude, location.latitude],
            ]),
        );
    }
}
</script>

<template>
    <div ref="mapContainer" class="relative h-full border-2 border-slate-200">
        <template v-if="isLoading">
            <div class="flex h-full items-center justify-center">
                <p class="text-gray-500">Loading...</p>
            </div>
        </template>
    </div>
</template>

<style lang="css">
@import '@/assets/styles/maps.css';
</style>
