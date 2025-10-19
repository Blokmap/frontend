<script setup lang="ts">
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';

// TODO: Add institutions loading logic
const isLoading = false;
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Content -->
    <div v-else class="institutions-page">
        <h1>Institutions</h1>
    </div>
</template>

<style scoped>
/* Add component-specific styles here */
</style>
