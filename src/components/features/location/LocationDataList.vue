<script lang="ts" setup>
import LocationItem from './LocationDataItem.vue';
import LocationItemSkeleton from './LocationDataItemSkeleton.vue';
import type { Location, LocationState } from '@/domain/location';

withDefaults(
    defineProps<{
        locations?: Location[];
        loading?: boolean;
        emptyMessage?: string;
        isLocationPending?: (locationId: number) => boolean;
    }>(),
    {
        loading: false,
        emptyMessage: 'No locations found',
        isLocationPending: () => false,
    },
);

const emit = defineEmits<{
    'click:location': [location: Location];
    'change:state': [locationId: number, status: LocationState];
}>();

const onLocationClick = (location: Location) => {
    emit('click:location', location);
};

const onChangeState = (locationId: number, status: LocationState) => {
    emit('change:state', locationId, status);
};
</script>

<template>
    <div class="location-data-list">
        <div class="space-y-4">
            <!-- Show skeleton items when loading -->
            <template v-if="loading">
                <LocationItemSkeleton v-for="i in 6" :key="`skeleton-${i}`" />
            </template>

            <!-- Show actual locations when not loading -->
            <template v-else>
                <LocationItem
                    v-for="location in locations"
                    :key="location.id"
                    :location="location"
                    :action-is-pending="isLocationPending?.(location.id)"
                    @click="onLocationClick"
                    @change:state="onChangeState">
                </LocationItem>
            </template>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
