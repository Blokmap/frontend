<script setup lang="ts">
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import DashboardLoading from '@/layouts/manage/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/manage/DashboardPageHeader.vue';

// TODO: Add authorities loading logic
const isLoading = false;
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <template v-else>
            <DashboardPageHeader :title="$t('pages.dashboard.authorities.index.title')" />
            <!-- TODO: Add authorities content -->
        </template>
    </DashboardContent>
</template>
