<script lang="ts" setup>
import Gallery from '@/components/shared/image/Gallery.vue';
import { useLocation } from '@/composables/data/useLocations';
import Skeleton from 'primevue/skeleton';

const { locationId } = defineProps<{ locationId: number }>();

const { data: location, isPending: isLoading, isError, error, isFetched } = useLocation(locationId);
</script>
<template>
    <template v-if="isError"> </template>
    <template v-else>
        <div class="space-y-6">
            <template v-if="location">
                <h1 class="text-2xl font-medium" v-if="location">{{ location.name }}</h1>
                <Gallery class="h-[50vh] min-h-[500px]" :images="location.images"> </Gallery>
            </template>
            <template v-else-if="isLoading"> <Skeleton /></template>
            <template v-else></template>
        </div>
    </template>
</template>
