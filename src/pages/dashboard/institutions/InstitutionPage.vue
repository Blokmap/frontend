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
            title="Institutie Niet Gevonden"
            message="De institutie die je zoekt bestaat niet of je hebt geen toegang." />

        <template v-else>
            <DashboardPageHeader title="Institutie Details" />
            <!-- TODO: Add institution details content -->
        </template>
    </DashboardContent>
</template>
