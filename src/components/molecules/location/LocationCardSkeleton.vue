<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>

<template>
    <div class="location-detail-skeleton">
        <Skeleton class="location-detail-skeleton__image" />
        <div class="location-detail-skeleton__content">
            <Skeleton class="location-detail-skeleton__name" />
            <Skeleton class="location-detail-skeleton__address" />
            <Skeleton class="location-detail-skeleton__excerpt" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-detail-skeleton {
    @apply flex h-full w-full flex-col rounded-xl;
}

.location-detail-skeleton__image {
    @apply !h-40 !w-full !rounded-t-xl !rounded-b-none;
}

.location-detail-skeleton__content {
    @apply flex flex-1 flex-col gap-2 rounded-b-xl bg-white p-4;
}

.location-detail-skeleton__name {
    @apply !h-6 !w-3/4;
}

.location-detail-skeleton__address {
    @apply !h-4 !w-1/2;
}

.location-detail-skeleton__excerpt {
    @apply !mt-2 !h-5 !w-full;
}
</style>
