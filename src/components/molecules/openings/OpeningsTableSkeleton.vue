<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
</script>

<template>
    <div class="space-y-4 rounded-lg border border-slate-200 p-4">
        <!-- Header with clock icon and title -->
        <div class="flex items-center gap-2">
            <Skeleton width="20px" height="20px" />
            <Skeleton width="120px" height="24px" />
        </div>

        <!-- Opening times table -->
        <div class="space-y-3">
            <div v-for="i in 7" :key="i" class="flex items-center justify-between">
                <!-- Day name -->
                <Skeleton width="80px" height="20px" />
                <!-- Time or closed badge -->
                <Skeleton width="100px" height="20px" />
            </div>
        </div>
    </div>
</template>
