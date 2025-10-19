<script setup lang="ts">
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';

// TODO: Add authorities loading logic
const isLoading = false;
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Content -->
    <div v-else class="authorities-page">
        <h1>Authorities</h1>
    </div>
</template>

<style scoped>
/* Add component-specific styles here */
</style>
