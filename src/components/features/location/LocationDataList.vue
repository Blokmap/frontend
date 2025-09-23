<script lang="ts" setup>
import LocationItem from './LocationItem.vue';
import LocationItemSkeleton from './LocationItemSkeleton.vue';
import type { Location } from '@/domain/location';

withDefaults(
    defineProps<{
        locations?: Location[];
        loading?: boolean;
        emptyMessage?: string;
    }>(),
    {
        loading: false,
        emptyMessage: 'No locations found',
    },
);

const emit = defineEmits<{
    'click:location': [location: Location];
}>();

const onLocationClick = (location: Location) => {
    emit('click:location', location);
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
                    @click="onLocationClick">
                </LocationItem>
            </template>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
