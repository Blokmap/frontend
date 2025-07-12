<script lang="ts" setup>
import type { Image } from '@/types/schema/Image';
import { computed } from 'vue';

const props = defineProps<{
    images?: Image[];
}>();

const placeholderModules = import.meta.glob('@/assets/img/placeholder/*', {
    eager: true,
    as: 'url',
});

const placeholderUrls = Object.entries(placeholderModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url as string);

const displayImages = computed(() => {
    const result = [...(props.images || [])];
    let i = 0;
    while (result.length < 5 && i < placeholderUrls.length) {
        result.push({ url: placeholderUrls[i++] });
    }
    return result;
});
</script>

<template>
    <div class="grid w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-xl">
        <!-- First image spans 2x2 -->
        <div class="col-span-2 row-span-2 aspect-square">
            <img :src="displayImages[0].url" alt="Main image" class="h-full object-cover" />
        </div>

        <div
            v-for="(img, idx) in displayImages.slice(1, 5)"
            :key="idx"
            class="aspect-square overflow-hidden">
            <img :src="img.url" alt="Gallery image" class="h-full w-full object-cover" />
        </div>
    </div>
</template>
