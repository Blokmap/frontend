<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>

<template>
    <div class="flex items-center gap-4 rounded-lg bg-gray-50 p-3">
        <div class="flex-shrink-0">
            <Skeleton shape="circle" size="2.5rem" />
        </div>
        <div class="min-w-0 flex-1 space-y-2">
            <Skeleton height="1rem" width="200px" />
            <Skeleton height="0.75rem" width="150px" />
        </div>
    </div>
</template>
