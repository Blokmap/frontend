<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ref } from 'vue';
import type { Location } from '@/types/model/Location';
import BlokMap from '@/components/features/blokmap/BlokMap.vue';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import LocationFilters from '@/components/features/location/LocationFilters.vue';

const locations = ref<Location[]>([]);
const selected = ref<Location | null>(null);
</script>

<template>
    <h1 class="text-center text-4xl font-extrabold my-16">
        Find your perfect <span class="text-secondary">study spot</span> in Flanders
    </h1>
    <div class="flex flex-col gap-8 w-full xl:w-2/3 mx-auto">
        <LocationSearch />
        <LocationFilters />
        <div class="max-h-full h-[600px]">
            <BlokMap :locations="locations" v-model:location="selected" rounded />
        </div>
    </div>
</template>
