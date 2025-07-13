<script lang="ts" setup>
import { useMapBox } from '@/composables/useMapBox';
import type { LngLat, LngLatBounds } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, ref, useTemplateRef, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        locations?: Location[];
        center?: LngLat | null;
        isLoading?: boolean;
        hoveredLocation?: Location | null;
        rounded?: boolean;
        shadow?: boolean;
        boundsDebounce?: number;
    }>(),
    {
        boundsDebounce: 400,
        rounded: true,
        shadow: false,
    },
);

const emit = defineEmits<{
    (e: 'change:bounds', value: LngLatBounds): void;
    (e: 'click:marker', id: number): void;
}>();

const mapContainer = useTemplateRef('mapContainer');
const map = useMapBox<number>(mapContainer);

watch(
    () => props.center,
    (newCenter) => {
        if (newCenter && map.isLoaded) {
            map.flyTo(newCenter);
        }
    },
    { immediate: true },
);

watch([() => props.locations, map.isLoaded], updateMarkers);

onMounted(() => {
    const debounceTimer = ref<number>();

    map.setOnMove(() => {
        // Clear the debounce timer if it exists
        if (debounceTimer.value) {
            clearTimeout(debounceTimer.value);
            debounceTimer.value = undefined;
        }
    });

    map.setOnBoundsChange((bounds) => {
        debounceTimer.value = setTimeout(() => {
            emit('change:bounds', bounds);
            debounceTimer.value = undefined;
        }, props.boundsDebounce);
    });

    map.setOnMarkerClick((id: number) => {
        emit('click:marker', id);
    });
});

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
    <div ref="mapContainer" class="map">
        <template v-if="isLoading && !map.isMoving.value">
            <div class="overlay">
                <FontAwesomeIcon class="text-4xl text-white" :icon="faSpinner" spin />
            </div>
        </template>
    </div>
</template>

<style lang="css">
@reference '@/assets/styles/main.css';
@import '@/assets/styles/maps.css';

.map {
    @apply relative z-2 h-full overflow-hidden rounded-xl border-2 border-slate-200;

    .overlay {
        @apply absolute top-0 right-0 bottom-0 left-0 z-2 flex h-full items-center justify-center bg-slate-800/30;
    }
}
</style>
