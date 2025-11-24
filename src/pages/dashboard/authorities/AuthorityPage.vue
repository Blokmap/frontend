<script setup lang="ts">
import DashboardContent from '@/layouts/manage/DashboardContent.vue';
import DashboardLoading from '@/layouts/manage/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/manage/DashboardNotFound.vue';
import DashboardPageHeader from '@/layouts/manage/DashboardPageHeader.vue';

// TODO: Add authority loading logic
const isLoading = false;
const notFound = false;
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <DashboardNotFound
            v-else-if="notFound"
            :title="$t('pages.dashboard.authorities.detail.notFound')"
            :message="$t('pages.dashboard.authorities.detail.notFoundMessage')" />

        <template v-else>
            <DashboardPageHeader :title="$t('pages.dashboard.authorities.detail.title')" />
            <!-- TODO: Add authority details content -->
        </template>
    </DashboardContent>
</template>
