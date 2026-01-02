<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
</script>

<template>
    <div class="skeleton">
        <Skeleton class="skeleton__image" />
        <div class="skeleton__content">
            <Skeleton class="skeleton__name" />
            <Skeleton class="skeleton__address" />
            <Skeleton class="skeleton__excerpt" />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.skeleton {
    @apply flex h-full w-full flex-col rounded-xl;

    .skeleton__image {
        @apply !h-40 !w-full !rounded-t-xl !rounded-b-none;
    }

    .skeleton__content {
        @apply flex flex-1 flex-col gap-2 p-4;
        @apply rounded-b-xl border border-slate-100 bg-white;

        .skeleton__name {
            @apply !h-6 !w-3/4;
        }

        .skeleton__address {
            @apply !h-4 !w-1/2;
        }

        .skeleton__excerpt {
            @apply !mt-2 !h-5 !w-full;
        }
    }
}
</style>
