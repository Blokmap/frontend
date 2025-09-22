<script lang="ts" setup>
import Button from 'primevue/button';
import { faSpinner, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useLocalStorage } from '@vueuse/core';
import { useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMapBox } from '@/composables/useMapBox';
import OpeningsTable from '../location/openings/OpeningsTable.vue';
import Marker from './Marker.vue';
import type { Location } from '@/domain/location';
import type { LngLatBounds, MapOptions } from '@/domain/map';

defineProps<{
    locations?: Location[];
    isLoading?: boolean;
}>();

const hoveredLocation = defineModel<Location | null>('hoveredLocation', {
    default: null,
});

const emit = defineEmits<{
    (e: 'click:marker', id: number): void;
    (e: 'update:bounds', bounds: LngLatBounds): void;
}>();

const mapContainerRef = useTemplateRef('mapContainer');
const config = useLocalStorage<MapOptions>('map', {});
const map = useMapBox(mapContainerRef, config.value);
const router = useRouter();

function handleMarkerClick(id: number): void {
    emit('click:marker', id);
}

function handleMarkerMouseEnter(location: Location) {
    hoveredLocation.value = location;
}

function handleMarkerMouseLeave() {
    // Don't hide popover on marker hover out - let it stay visible
}

function handleLocationDetailClick(locationId: number): void {
    router.push({ name: 'locations.detail', params: { locationId } });
}

watch(
    map.bounds,
    (newBounds) => {
        emit('update:bounds', newBounds);
        config.value.center = map.center.value;
        config.value.zoom = map.zoom.value;
    },
    { deep: true },
);

defineExpose({ map });
</script>

<template>
    <div ref="mapContainer" class="map">
        <div v-if="isLoading" class="loader">
            <span>Loading</span>
            <FontAwesomeIcon :icon="faSpinner" spin />
        </div>
        <slot v-if="map.isLoaded.value">
            <Marker
                v-for="location in locations"
                :id="location.id"
                :key="location.id"
                :position="[location.longitude, location.latitude]"
                :map="map"
                :active="location.id === hoveredLocation?.id"
                @click="handleMarkerClick(location.id)"
                @mouseenter="handleMarkerMouseEnter(location)"
                @mouseleave="handleMarkerMouseLeave">
                <template #popover>
                    <div class="w-full space-y-2 p-1">
                        <p class="text-lg font-semibold">
                            {{ location.name }}
                        </p>

                        <p>
                            {{ location.street }} {{ location.number }} • {{ location.zip }}
                            {{ location.city }}
                        </p>

                        <OpeningsTable class="my-3" :opening-times="location.openingTimes" compact>
                        </OpeningsTable>

                        <div class="flex justify-end">
                            <Button
                                @click="handleLocationDetailClick(location.id)"
                                size="small"
                                text>
                                Meer Informatie
                                <FontAwesomeIcon :icon="faArrowRight" class="ml-2" />
                            </Button>
                        </div>
                    </div>
                </template>
            </Marker>
        </slot>
    </div>
</template>

<style lang="css" scoped>
@reference '@/assets/styles/main.css';

.loader {
    @apply absolute top-4 left-1/2 z-50 -translate-x-1/2 transform;
    @apply rounded-full bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-md;
    @apply flex items-center justify-center gap-2;
}
</style>
