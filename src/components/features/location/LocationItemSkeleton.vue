<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>

<template>
    <div class="location-card">
        <!-- Skeleton Image -->
        <div class="flex-shrink-0">
            <div class="location-image-container">
                <Skeleton class="!h-full !w-full !rounded-xl" />
            </div>
        </div>

        <!-- Skeleton Content -->
        <div class="min-w-0 flex-1">
            <!-- Skeleton Header -->
            <div class="location-header">
                <Skeleton class="!h-6 !w-2/3" />
                <Skeleton class="!h-4 !w-1/2" />
            </div>

            <!-- Skeleton Description -->
            <Skeleton class="!h-16 !w-full" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

/* Location card styling */
.location-card {
    @apply flex gap-6 rounded-lg border border-slate-200 bg-white p-4;

    .location-image-container {
        @apply relative h-32 w-32 overflow-hidden rounded-xl;
    }

    .location-header {
        @apply mb-3 flex flex-col gap-1;
    }
}
</style>
