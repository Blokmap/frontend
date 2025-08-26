<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
</script>
<template>
    <div class="grid h-full w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl">
        <Skeleton class="col-span-2 row-span-2" height="100%" width="100%" />
        <Skeleton v-for="idx in 4" :key="idx" height="100%" width="100%" />
    </div>
</template>
