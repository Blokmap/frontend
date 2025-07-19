<script lang="ts" setup>
import { useMapBox } from '@/composables/useMapBox';
import type { LngLatBounds } from '@/types/contract/Map';
import type { Location } from '@/types/schema/Location';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onMounted, provide, ref, useTemplateRef } from 'vue';

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

    const bounds = map.getBounds();

    if (bounds) {
        emit('change:bounds', bounds);
    }
});

defineExpose({ map });
provide('map', map);
</script>

<template>
    <div ref="mapContainer" class="map">
        <div class="loader" v-if="isLoading">
            <span>Loading</span>
            <FontAwesomeIcon :icon="faSpinner" spin />
        </div>
        <slot></slot>
    </div>
</template>

<style lang="css">
@reference '@/assets/styles/main.css';
@import '@/assets/styles/maps.css';

.map {
    @apply relative z-2 h-full overflow-hidden rounded-xl border-2 border-slate-200;

    .loader {
        @apply absolute top-4 left-1/2 z-50  -translate-x-1/2 transform;
        @apply rounded-full bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-md;
        @apply flex items-center justify-center gap-2;
    }
}
</style>
