<script lang="ts" setup>
import Button from 'primevue/button';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRefsList } from '@vueuse/core';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useItemAnimation } from '@/composables/anim/useItemAnimation';
import type { Image } from '@/domain/image';

const props = defineProps<{
    images: Image[];
    placeholder?: string;
}>();

const imageRefs = useTemplateRefsList();

const { cleanupAnimation } = useItemAnimation(imageRefs, { duration: 0.5 });

const isFullscreen = ref(false);
const selectedImageIndex = ref(0);

const primaryImage = computed(() => {
    return props.images.find((img) => img.index === 0);
});

const secondaryImages = computed(() => {
    return props.images.filter((img) => img.index !== 0);
});

const gridClasses = computed(() => {
    const count = props.images.length;
    if (count <= 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-2 grid-rows-1';
    return 'grid-cols-4 grid-rows-2';
});

const imageLayout = computed(() => {
    const count = props.images.length;

    if (count <= 2) {
        return props.images.map((img, idx) => ({
            image: img,
            index: idx,
            classes: 'gallery-image-container',
        }));
    }

    const layout = [];
    const primary = primaryImage.value;
    const secondary = secondaryImages.value;

    layout.push({
        image: primary,
        index: 0,
        classes: 'col-span-2 row-span-2',
    });

    if (count === 3) {
        secondary.forEach((img, idx) => {
            layout.push({
                image: img,
                index: idx + 1,
                classes: 'col-span-2',
            });
        });
    } else {
        secondary.slice(0, 2).forEach((img, idx) => {
            layout.push({
                image: img,
                index: idx + 1,
            });
        });

        if (secondary.length > 2) {
            layout.push({
                image: secondary[2],
                index: 3,
                classes: 'col-span-2',
            });
        }
    }

    return layout;
});

async function openFullScreen(index: number): Promise<void> {
    isFullscreen.value = true;
    selectedImageIndex.value = index;

    await nextTick();

    const element = document.getElementById(`gallery-image-${index}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function closeFullscreen(): void {
    isFullscreen.value = false;
}

function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && isFullscreen.value) {
        closeFullscreen();
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    cleanupAnimation();
});
</script>

<template>
    <!-- Image grid -->
    <div v-if="images.length > 0" :class="['gallery', gridClasses]">
        <div
            v-for="item in imageLayout"
            :key="item.index"
            :ref="imageRefs.set"
            :class="['gallery-image-container', item.classes]"
            @click="openFullScreen(item.index)">
            <img v-if="item.image" :src="item.image.url" class="gallery-image" />
        </div>
    </div>

    <!-- Placeholder when no images -->
    <div v-else-if="placeholder" class="gallery grid-cols-1 grid-rows-1">
        <div class="gallery-image-container">
            <img :src="placeholder" class="gallery-image" />
        </div>
    </div>

    <!-- Fullscreen modal -->
    <Transition name="scale">
        <div v-if="isFullscreen" class="gallery-fullscreen">
            <!-- Header with close and share buttons -->
            <div class="flex items-center justify-between p-4">
                <Button severity="contrast" rounded text @click="closeFullscreen">
                    <template #icon>
                        <FontAwesomeIcon :icon="faChevronLeft" />
                    </template>
                </Button>
                <Button severity="contrast" text class="underline"> Delen </Button>
            </div>

            <!-- Scrollable image grid -->
            <div class="gallery-grid-container">
                <div class="gallery-grid">
                    <div
                        v-for="(image, index) in images"
                        :id="`gallery-image-${index}`"
                        :key="index"
                        class="gallery-grid-item">
                        <img
                            :src="image.url"
                            :alt="`Gallery image ${index + 1}`"
                            class="gallery-grid-image" />
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.gallery {
    @apply grid h-full w-full gap-2 overflow-hidden rounded-xl;
}

.gallery-image-container {
    @apply relative cursor-pointer overflow-hidden;

    &:hover .gallery-image {
        @apply scale-110 brightness-75;
    }

    .gallery-image {
        @apply h-full w-full object-cover transition-all duration-300;
        @apply shadow-md;
    }
}

.gallery-fullscreen {
    @apply fixed top-0 left-0 z-50 flex h-full w-full flex-col bg-white;

    .gallery-grid-container {
        @apply flex flex-1 justify-center overflow-y-auto p-4 pb-[88px];
    }

    .gallery-grid {
        @apply grid w-full max-w-2xl grid-cols-2 gap-2;

        .gallery-grid-item {
            @apply overflow-hidden rounded-lg;

            &:nth-child(3n + 1) {
                @apply col-span-2;
            }

            &:last-child:nth-child(3n + 2) {
                @apply col-span-2;
            }
        }

        .gallery-grid-image {
            @apply h-full w-full cursor-pointer object-cover;
        }
    }
}
</style>
