<script setup lang="ts">
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';

// TODO: Add institution loading logic
const isLoading = false;
const notFound = false;
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <DashboardNotFound
            v-else-if="notFound"
            :title="$t('pages.dashboard.institutions.detail.notFound')"
            :message="$t('pages.dashboard.institutions.detail.notFoundMessage')" />

        <template v-else>
            <DashboardPageHeader :title="$t('pages.dashboard.institutions.detail.title')" />
            <!-- TODO: Add institution details content -->
        </template>
    </DashboardContent>
</template>
