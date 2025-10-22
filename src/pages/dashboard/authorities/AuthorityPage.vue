<script setup lang="ts">
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardNotFound from '@/layouts/dashboard/DashboardNotFound.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';

// TODO: Add authority loading logic
const isLoading = false;
const notFound = false;
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <DashboardNotFound
            v-else-if="notFound"
            title="Autoriteit Niet Gevonden"
            message="De autoriteit die je zoekt bestaat niet of je hebt geen toegang." />

        <template v-else>
            <DashboardPageHeader title="Autoriteit Details" />
            <!-- TODO: Add authority details content -->
        </template>
    </DashboardContent>
</template>
