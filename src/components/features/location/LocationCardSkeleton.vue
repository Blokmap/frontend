<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>

<template>
    <div class="flex flex-col gap-2">
        <Skeleton class="!aspect-square !h-auto w-full" />
        <Skeleton class="!h-6" />
        <Skeleton class="!h-12" />
    </div>
</template>
