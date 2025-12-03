<script lang="ts" setup>
import { computed } from 'vue';
import { useReadLocation } from '@/composables/data/useLocations';
import ManagementLoader from '../ManagementLoader.vue';
import ManagementLoaderError from '../ManagementLoaderError.vue';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    locationId: string;
}>();

const locationId = computed(() => +props.locationId);

const { data: location, isLoading, error } = useReadLocation(locationId);
</script>

<template>
    <div>
        <ManagementLoader v-if="isLoading" />
        <RouterView
            v-else-if="location"
            :location="location"
            :auth-profile="authProfile"
            :error="error">
        </RouterView>
        <ManagementLoaderError v-else :error="error" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
