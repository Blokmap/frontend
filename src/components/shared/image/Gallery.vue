<script lang="ts" setup>
import placeholder from '@/assets/img/placeholder/location-placeholder.svg';
import type { Image } from '@/domain/image';
import { computed } from 'vue';

const props = defineProps<{
    images?: Image[];
}>();

const paddedImages = computed(() => {
    const images = [...(props.images ?? [])]; // Create a copy to avoid mutating props

    // Add placeholders to fill up to 5 images
    while (images.length < 5) {
        images.push({ url: placeholder });
    }

    return images;
});

const primaryImage = computed(() => {
    return paddedImages.value.find((img) => img.index === 0) ?? paddedImages.value[0];
});

const secondaryImages = computed(() => {
    return paddedImages.value.filter((img) => img !== primaryImage.value).slice(0, 4);
});
</script>

<template>
    <div class="grid h-64 w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl">
        <!-- First image spans 2x2 -->
        <div class="col-span-2 row-span-2">
            <img :src="primaryImage.url" alt="Main image" class="h-full w-full object-cover" />
        </div>
        <!-- Other images span 1x1 each -->
        <div v-for="(img, idx) in secondaryImages" :key="idx" class="h-full w-full">
            <img :src="img.url" alt="Gallery image" class="h-full w-full object-cover" />
        </div>
    </div>
</template>
