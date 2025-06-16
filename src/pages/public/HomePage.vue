<script lang="ts" setup>
import LocationCard from '@/components/features/location/LocationCard.vue';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import { useLocationsSearch } from '@/composables/services/useLocations';
import type { LocationFilter } from '@/types/schema/Filter';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import { ref } from 'vue';

const filters = ref<LocationFilter>({ perPage: 50 });
const { locations, locationsIsLoading } = useLocationsSearch(filters);
</script>

<template>
    <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold"><span class="text-secondary">Populaire</span> locaties</h2>
        <div class="flex items-center gap-2">
            <Button size="small" severity="secondary" class="h-6 w-6 text-xs" rounded>
                <template #icon>
                    <FontAwesomeIcon :icon="faChevronLeft" />
                </template>
            </Button>
            <Button size="small" severity="secondary" class="h-6 w-6 text-xs" rounded>
                <template #icon>
                    <FontAwesomeIcon :icon="faChevronRight" />
                </template>
            </Button>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
        <template v-if="locationsIsLoading">
            <template v-for="n in 6" :key="n">
                <LocationCardSkeleton />
            </template>
        </template>
        <template v-else>
            <template v-for="location in locations?.data?.slice(0, 6)" :key="location.id">
                <RouterLink :to="{ name: 'home' }">
                    <LocationCard :location="location" />
                </RouterLink>
            </template>
        </template>
    </div>

    <Divider class="my-8" />

    <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xl font-bold"><span class="text-secondary">Favoriete</span> locaties</h2>
        <div class="flex items-center gap-2">
            <Button size="small" severity="secondary" class="h-6 w-6 text-xs" rounded>
                <template #icon>
                    <FontAwesomeIcon :icon="faChevronLeft" />
                </template>
            </Button>
            <Button size="small" severity="secondary" class="h-6 w-6 text-xs" rounded>
                <template #icon>
                    <FontAwesomeIcon :icon="faChevronRight" />
                </template>
            </Button>
        </div>
    </div>

    <div class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
        <template v-if="locationsIsLoading">
            <template v-for="n in 6" :key="n">
                <LocationCardSkeleton />
            </template>
        </template>
        <template v-else>
            <template v-for="location in locations?.data?.slice(0, 6)" :key="location.id">
                <RouterLink :to="{ name: 'home' }">
                    <LocationCard :location="location" />
                </RouterLink>
            </template>
        </template>
    </div>
</template>
