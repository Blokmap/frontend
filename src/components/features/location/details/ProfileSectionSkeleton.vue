<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';

withDefaults(
    defineProps<{
        avatarClass?: string;
    }>(),
    {},
);
</script>

<template>
    <div class="flex items-center gap-6 border-y-2 border-slate-200 py-3">
        <!-- Avatar skeleton -->
        <Skeleton width="56px" height="56px" class="rounded-full" />

        <!-- Profile info skeleton -->
        <div class="flex-1 space-y-1">
            <!-- Name skeleton -->
            <Skeleton width="200px" height="24px" />
            <!-- Date skeleton -->
            <Skeleton width="150px" height="16px" />
        </div>
    </div>
</template>
