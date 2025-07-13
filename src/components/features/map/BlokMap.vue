<script lang="ts" setup>
import { useMapBox } from '@/composables/useMapBox';
import type { LngLat, LngLatBounds } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { onMounted, provide, ref, useTemplateRef, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        locations?: Location[];
        isLoading?: boolean;
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
}>();

const mapContainerRef = useTemplateRef('mapContainer');
const map = useMapBox(mapContainerRef);

defineExpose({ map });
provide('map', map);

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
});
</script>

<template>
    <div ref="mapContainer" class="map">
        <slot></slot>
    </div>
</template>

<style lang="css">
@reference '@/assets/styles/main.css';
@import '@/assets/styles/maps.css';

.map {
    @apply relative z-2 h-full overflow-hidden rounded-xl border-2 border-slate-200;
}
</style>
