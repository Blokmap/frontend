<script setup lang="ts">
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';

// TODO: Add institution loading logic
const isLoading = false;
const notFound = false;
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Not Found State -->
    <DashboardNotFound
        v-else-if="notFound"
        title="Institutie Niet Gevonden"
        message="De institutie die je zoekt bestaat niet of je hebt geen toegang." />

    <!-- Content -->
    <div v-else class="institution-page">
        <h1>Institution Details</h1>
    </div>
</template>

<style scoped>
/* Add component-specific styles here */
</style>
