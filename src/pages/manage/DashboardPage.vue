<script setup lang="ts">
import DashboardLoading from '@/layouts/manage/DashboardLoading.vue';
import type { Profile } from '@/domain/profile';

// TODO: Add dashboard loading logic
defineProps<{ profile: Profile }>();
const isLoading = false;
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Content -->
    <template v-else>Hellaaaur</template>
</template>
