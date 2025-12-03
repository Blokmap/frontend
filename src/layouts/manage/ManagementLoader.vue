<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
</script>

<template>
    <div class="management-loader">
        <!-- Breadcrumb skeleton -->
        <div class="management-loader__breadcrumb">
            <Skeleton class="!h-4 !w-20" />
            <span class="text-slate-300">/</span>
            <Skeleton class="!h-4 !w-32" />
        </div>

        <!-- Title skeleton -->
        <Skeleton class="management-loader__title" />

        <!-- Content skeleton -->
        <div class="management-loader__content">
            <Skeleton class="!h-4 !w-full" />
            <Skeleton class="!h-4 !w-3/4" />
            <Skeleton class="!h-4 !w-1/2" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.management-loader {
    @apply flex flex-col gap-6;
}

.management-loader__breadcrumb {
    @apply flex items-center gap-2;
}

.management-loader__title {
    @apply !h-8 !w-48;
}

.management-loader__content {
    @apply flex flex-col gap-3;
}
</style>
