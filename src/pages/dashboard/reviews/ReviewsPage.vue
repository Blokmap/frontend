<script setup lang="ts">
import DashboardContent from '@/layouts/dashboard/DashboardContent.vue';
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';
import DashboardPageHeader from '@/layouts/dashboard/DashboardPageHeader.vue';

// TODO: Add reviews loading logic
const isLoading = false;
</script>

<template>
    <DashboardContent>
        <DashboardLoading v-if="isLoading" />

        <template v-else>
            <DashboardPageHeader
                :title="$t('pages.dashboard.reviews.index.title')"
                :subtitle="$t('pages.dashboard.reviews.index.subtitle')" />

            <div class="rounded-lg bg-white p-4 shadow md:p-6">
                <p class="text-gray-500">
                    {{ $t('pages.dashboard.reviews.index.description') }}
                </p>
                <ul class="mt-4 space-y-2 text-gray-600">
                    <li>• {{ $t('pages.dashboard.reviews.index.features.overview') }}</li>
                    <li>• {{ $t('pages.dashboard.reviews.index.features.moderate') }}</li>
                    <li>• {{ $t('pages.dashboard.reviews.index.features.reported') }}</li>
                    <li>• {{ $t('pages.dashboard.reviews.index.features.statistics') }}</li>
                </ul>
            </div>
        </template>
    </DashboardContent>
</template>
