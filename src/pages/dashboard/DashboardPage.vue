<script setup lang="ts">
import DashboardLoading from '@/components/shared/molecules/DashboardLoading.vue';

// TODO: Add dashboard loading logic
const isLoading = false;
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Content -->
    <template v-else>Hellaaaur</template>
</template>
