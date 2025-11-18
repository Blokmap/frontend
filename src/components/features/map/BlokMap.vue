<script lang="ts" setup>
import Carousel from '@/components/shared/molecules/Carousel.vue';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import { useTemplateRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useMapBox } from '@/composables/maps/useMapBox';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import { getLocationPlaceholderImage, type Location } from '@/domain/location';
import Marker from './Marker.vue';
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

const { locale } = useI18n();
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
function navigateToDetail(locationId: number): void {
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
                <template #popover="{ closePopover }">
                    <div class="location-popover" @click="navigateToDetail(location.id)">
                        <!-- Carousel for location images -->
                        <div class="location-popover__carousel">
                            <Carousel
                                :items="
                                    location.images && location.images.length > 0
                                        ? location.images
                                        : [
                                              {
                                                  id: 0,
                                                  url: getLocationPlaceholderImage(location),
                                                  index: 0,
                                              },
                                          ]
                                "
                                :show-navigation-buttons="true"
                                :show-dots="true">
                                <template #default="{ item }">
                                    <img
                                        :src="item.url"
                                        alt="Location Image"
                                        class="location-popover__image" />
                                </template>
                            </Carousel>

                            <!-- Close button overlayed on carousel -->
                            <button
                                type="button"
                                class="location-popover__close"
                                @click.stop="closePopover"
                                aria-label="Close">
                                <FontAwesomeIcon :icon="faTimes" />
                            </button>
                        </div>

                        <!-- Location details -->
                        <div class="location-popover__details">
                            <h3 class="location-popover__name">
                                {{ location.name }}
                            </h3>
                            <p class="location-popover__excerpt">
                                {{ location.excerpt[locale] }}
                            </p>
                            <p class="location-popover__address">
                                {{ location.street }} {{ location.number }}, {{ location.zip }}
                                {{ location.city }}
                            </p>
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
    @apply rounded bg-white px-6 py-2 text-sm font-medium text-slate-700 shadow-md;
    @apply flex items-center justify-center gap-2;
}

.location-popover {
    @apply w-full cursor-pointer;
}

.location-popover__carousel {
    @apply relative w-full;
}

.location-popover__image {
    @apply aspect-[4/3] w-full object-cover;
}

.location-popover__close {
    @apply absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-md transition-all hover:scale-110 hover:bg-white;
}

.location-popover__details {
    @apply space-y-1.5 px-4 py-3;
}

.location-popover__name {
    @apply text-lg font-semibold text-gray-900;
}

.location-popover__excerpt {
    @apply text-sm text-gray-600;
}

.location-popover__address {
    @apply text-sm text-gray-500;
}
</style>
