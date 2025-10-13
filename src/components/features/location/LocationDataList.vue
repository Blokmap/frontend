<script lang="ts" setup>
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
</script>

<template>
    <div class="location-data-list">
        <div class="flex flex-col gap-4">
            <!-- Show skeleton items when loading -->
            <template v-if="loading"> </template>

            <!-- Show actual locations when not loading -->
            <template v-else>
                <slot
                    v-for="location in locations"
                    :key="location.id"
                    :location="location"
                    name="item">
                </slot>
            </template>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
