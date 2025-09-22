<template>
    <div class="location-page">
        <h1>Location Details</h1>
        <p v-if="locationId">Location ID: {{ locationId }}</p>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePageTitleStore } from '@/composables/store/usePageTitle';

const route = useRoute();
const { setPageTitle } = usePageTitleStore();

const locationId = route.params.locationId as string;

onMounted(() => {
    setPageTitle(`Locatie ${locationId} Beheer`);
});
</script>

<style scoped></style>
