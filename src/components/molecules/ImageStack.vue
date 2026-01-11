<script setup lang="ts">
import Skeleton from 'primevue/skeleton';
import type { Image } from '@/domain/image';

defineProps<{
    images?: Image[];
}>();

const getStackStyle = (index: number, total: number) => {
    if (total === 1) return {};

    // Index 0 (Newest) -> Front/Left
    if (index === 0) {
        return {
            zIndex: 3,
            transform: 'rotate(-8deg) translate(-10%, 10%) scale(1)',
        };
    }

    // Index 1 (Older) -> Right
    if (index === 1) {
        return {
            zIndex: 2,
            transform: 'rotate(15deg) translate(20%, 5%) scale(0.95)',
        };
    }

    // Index 2 (Oldest) -> Back
    if (index === 2) {
        return {
            zIndex: 1,
            transform: 'rotate(-5deg) translate(5%, -15%) scale(0.9)',
        };
    }

    return {
        zIndex: total - index,
        transform: `rotate(${(index - (total - 1) / 2) * 10}deg)`,
    };
};
</script>

<template>
    <div class="image-stack">
        <template v-if="images">
            <div
                v-for="(image, index) in images"
                :key="image.id"
                class="image-stack__item"
                :style="getStackStyle(index, images.length)">
                <img :src="image.url" alt="Location image" class="image-stack__img" />
            </div>
        </template>
        <template v-else>
            <div
                v-for="index in 3"
                :key="index"
                class="image-stack__item"
                :style="getStackStyle(index - 1, 3)">
                <Skeleton width="100%" height="100%" />
            </div>
        </template>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.image-stack {
    @apply relative isolate flex h-full w-full items-center justify-center;
}

.image-stack__item {
    @apply absolute h-[90%] w-[90%] overflow-hidden rounded border-2 border-white shadow-sm transition-transform;
}

.image-stack__img {
    @apply h-full w-full object-cover;
}
</style>
