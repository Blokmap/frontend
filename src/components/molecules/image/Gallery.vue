<script lang="ts" setup>
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { onKeyStroke } from '@vueuse/core';
import { computed, nextTick, ref } from 'vue';
import { sortImagesByIndex, type Image } from '@/domain/image';

const props = withDefaults(
    defineProps<{
        images: Image[];
        placeholder?: string;
        loading?: boolean;
        fullscreen?: boolean;
    }>(),
    {
        fullscreen: true,
    },
);

const emit = defineEmits<{
    'click:fullscreen': [];
}>();

const isFullscreen = ref<boolean>(false);
const selectedImageIndex = ref<number>(0);

const images = computed<Image[]>(() => {
    return sortImagesByIndex(props.images);
});

const totalImagesCount = computed<number>(() => props.images.length);

const gridClasses = computed<string>(() => {
    const count = props.images.length;
    if (count === 1) return 'md:grid-cols-1';
    if (count === 2) return 'md:grid-cols-2';
    return 'md:grid-cols-4 md:grid-rows-2';
});

type DisplayImage = {
    image: Image;
    index: number;
    classes?: string;
};

const displayImages = computed<DisplayImage[]>(() => {
    const count = props.images.length;

    if (count === 1) return [{ image: images.value[0], index: 0 }];
    if (count === 2) return images.value.map((img, idx) => ({ image: img, index: idx }));

    // For 3 images: primary 2x2, others 2x1 stacked on right
    if (count === 3) {
        return [
            { image: images.value[0], index: 0, classes: 'md:col-span-2 md:row-span-2' },
            { image: images.value[1], index: 1, classes: 'md:col-span-2' },
            { image: images.value[2], index: 2, classes: 'md:col-span-2' },
        ];
    }

    // For 4+ images: primary 2x2, two 1x1 on top right, last spans bottom right
    const layout: DisplayImage[] = [
        { image: images.value[0], index: 0, classes: 'md:col-span-2 md:row-span-2' },
        { image: images.value[1], index: 1 },
        { image: images.value[2], index: 2 },
        { image: images.value[3], index: 3, classes: 'md:col-span-2' },
    ];

    return layout;
});

const openFullScreen = async (index: number): Promise<void> => {
    emit('click:fullscreen');

    if (props.fullscreen) {
        isFullscreen.value = true;
        selectedImageIndex.value = index;

        await nextTick();

        const element = document.getElementById(`gallery-image-${index}`);

        element?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
        });
    }
};

const closeFullscreen = (): void => {
    isFullscreen.value = false;
};

const showLabel = (item: DisplayImage): boolean => {
    const displayed = displayImages.value;
    const total = totalImagesCount.value;

    return item.index === displayed[displayed.length - 1].index && total > 1;
};

onKeyStroke('Escape', () => {
    if (isFullscreen.value) {
        closeFullscreen();
    }
});
</script>

<template>
    <!-- Loading State -->
    <div v-if="loading" class="gallery">
        <Skeleton height="100%" width="100%" />
    </div>

    <!-- Image Grid -->
    <div v-else-if="images.length > 0" :class="['gallery', gridClasses]">
        <div
            v-for="(item, idx) in displayImages"
            :key="item.index"
            :class="['gallery__item', item.classes, { 'hidden md:block': idx > 0 }]"
            @click="openFullScreen(item.index)">
            <img :src="item.image.url" class="gallery__image" />

            <!-- Bottom Banner Overlay (only on last visible image) -->
            <div v-if="showLabel(item)" class="gallery__banner">
                <slot name="label">
                    <span>Bekijk {{ totalImagesCount }} foto's</span>
                </slot>
            </div>
        </div>
    </div>

    <!-- Placeholder when no images -->
    <div v-else-if="placeholder" class="gallery">
        <img :src="placeholder" class="gallery__image" />
    </div>

    <!-- Fullscreen modal -->
    <Transition name="scale">
        <div v-if="isFullscreen" class="gallery-fullscreen">
            <div class="gallery-fullscreen__header">
                <Button severity="contrast" rounded text @click="closeFullscreen">
                    <template #icon>
                        <FontAwesomeIcon :icon="faChevronLeft" />
                    </template>
                </Button>
            </div>

            <div class="gallery-fullscreen__container">
                <slot name="fullscreen">
                    <div class="gallery-fullscreen__grid">
                        <div
                            v-for="(image, index) in images"
                            :id="`gallery-image-${index}`"
                            :key="index"
                            class="gallery-fullscreen__grid-item">
                            <img
                                :src="image.url"
                                :alt="`Gallery image ${index + 1}`"
                                class="gallery-fullscreen__grid-image" />
                        </div>
                    </div>
                </slot>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.gallery {
    @apply h-full w-full overflow-hidden rounded-lg md:grid md:gap-2;
}

.gallery__item {
    @apply relative h-full cursor-pointer overflow-hidden rounded-lg;

    &:hover .gallery__image {
        @apply scale-110 brightness-90;
    }
}

.gallery__image {
    @apply h-full w-full object-cover transition-all duration-300;
}

.gallery__banner {
    @apply absolute right-0 bottom-0 left-0 flex items-center justify-center bg-black/60 py-3 text-sm font-semibold text-white md:text-base;
}

.gallery-fullscreen {
    @apply fixed top-0 left-0 z-50 flex h-[100dvh] w-[100dvw] flex-col overflow-y-auto bg-white;

    .gallery-fullscreen__header {
        @apply flex items-center justify-between p-2 md:p-4;
    }

    .gallery-fullscreen__container {
        @apply flex flex-1 justify-center p-2 !pb-[88px] md:p-4;
    }

    .gallery-fullscreen__grid {
        @apply grid w-full max-w-3xl grid-cols-1 gap-2 md:grid-cols-2;
    }

    .gallery-fullscreen__grid-image {
        @apply h-full w-full cursor-pointer object-cover;
    }

    .gallery-fullscreen__grid-item {
        @apply overflow-hidden rounded-lg;
        @apply col-span-1;

        &:nth-child(3n + 1) {
            @apply md:col-span-2;
        }

        &:last-child:nth-child(3n + 2) {
            @apply md:col-span-2;
        }
    }
}
</style>
