<script lang="ts" setup>
import BlokMap from '@/components/features/blokmap/BlokMap.vue';
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import type { Location } from '@/types/model/Location';
import { ref } from 'vue';

const locations = ref<Location[]>([]);
const selected = ref<Location | null>(null);
</script>

<template>
    <h1 class="text-center text-4xl font-extrabold my-16">
        Find your perfect <span class="text-secondary">study spot</span> in Flanders
    </h1>
    <div class="flex flex-col gap-8 w-full xl:w-2/3 mx-auto mb-16">
        <LocationSearch />
        <div class="max-h-full h-[600px]">
            <BlokMap :locations="locations" v-model:location="selected" ref="blokmap" rounded>
            </BlokMap>
        </div>
    </div>
</template>
