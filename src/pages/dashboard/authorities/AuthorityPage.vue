<script setup lang="ts">
import DashboardLoading from '@/components/shared/molecules/DashboardLoading.vue';
import DashboardNotFound from '@/components/shared/molecules/DashboardNotFound.vue';

// TODO: Add authority loading logic
const isLoading = false;
const notFound = false;
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Not Found State -->
    <DashboardNotFound
        v-else-if="notFound"
        title="Autoriteit Niet Gevonden"
        message="De autoriteit die je zoekt bestaat niet of je hebt geen toegang." />

    <!-- Content -->
    <div v-else class="authority-page">
        <h1>Authority Details</h1>
    </div>
</template>

<style scoped>
/* Add component-specific styles here */
</style>
