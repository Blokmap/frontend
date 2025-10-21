<script lang="ts" setup>
import Button from 'primevue/button';
import OpeningsTable from '@/components/features/openings/OpeningsTable.vue';
import { faSpinner, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { useTemplateRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useMapBox } from '@/composables/maps/useMapBox';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import Marker from './Marker.vue';
import type { Location } from '@/domain/location';
import type { LngLatBounds } from '@/domain/map';

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

const router = useRouter();

const filters = storeToRefs(useLocationFilters());

const mapContainerRef = useTemplateRef('mapContainer');
const map = useMapBox(mapContainerRef, filters.config.value);

/**
 * Handle marker click event.
 * @param id - Location ID
 */
function onMarkerClick(id: number): void {
    emit('click:marker', id);
}

/**
 * Handle marker mouse enter event.
 * @param location - Location data
 */
function onMarkerMouseEnter(location: Location) {
    hoveredLocation.value = location;
}
/**
 * Handle marker mouse leave event.
 */
function onMarkerMouseLeave() {
    hoveredLocation.value = null;
}

/**
 * Navigate to location detail page.
 * @param locationId - Location ID
 */
function onLocationDetailClick(locationId: number): void {
    router.push({ name: 'locations.detail', params: { locationId } });
}

watch(
    map.bounds,
    (newBounds) => {
        emit('update:bounds', newBounds);
        filters.config.value.center = map.center.value;
        filters.config.value.zoom = map.zoom.value;
        filters.config.value.bounds = newBounds;
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
                @click="onMarkerClick(location.id)"
                @mouseenter="onMarkerMouseEnter(location)"
                @mouseleave="onMarkerMouseLeave">
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
                            <Button @click="onLocationDetailClick(location.id)" size="small" text>
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
