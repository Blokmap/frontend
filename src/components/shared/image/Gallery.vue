<script lang="ts" setup>
import placeholder from '@/assets/img/placeholder/location-placeholder.svg';
import { useItemAnimation } from '@/composables/anim/useItemAnimation';
import type { Image } from '@/domain/image';
import { LOCATION_SETTINGS } from '@/domain/location';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRefsList } from '@vueuse/core';
import Button from 'primevue/button';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
    images: Image[];
}>();

const isFullscreen = ref(false);
const selectedImageIndex = ref(0);

const imageRefs = useTemplateRefsList();

useItemAnimation(imageRefs, { duration: 0.5 });

const secondaryImages = computed(() => {
    return props.images.filter((img) => img.index !== 0);
});

const primaryImage = computed(() => {
    return (
        props.images.find((img) => img.index === 0) ?? {
            url: placeholder,
            index: 0,
        }
    );
});

const gridConfig = computed(() => {
    const count = props.images.length;

    if (count === 0) return null;
    if (count === 1) return { cols: 1, rows: 1 };
    if (count === 2) return { cols: 2, rows: 1 };
    return { cols: 4, rows: 2 };
});

const gridClasses = computed(() => {
    const count = props.images.length;
    if (count === 0) return '';
    if (count === 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-2 grid-rows-1';
    return 'grid-cols-4 grid-rows-2';
});

const getItemClasses = (item: any) => {
    const base = 'gallery-image-container';
    const colSpan = item.colSpan === 1 ? '' : item.colSpan === 2 ? 'col-span-2' : 'col-span-4';
    const rowSpan = item.rowSpan === 1 ? '' : 'row-span-2';
    return [base, colSpan, rowSpan].filter(Boolean).join(' ');
};

const imageLayout = computed(() => {
    const count = props.images.length;

    if (count <= 2) {
        return props.images.map((img, idx) => ({
            image: img,
            index: idx,
            colSpan: count === 1 ? 1 : 1,
            rowSpan: 1,
        }));
    }

    if (count === 3) {
        return [
            { image: primaryImage.value, index: 0, colSpan: 2, rowSpan: 2 },
            ...secondaryImages.value.map((img, idx) => ({
                image: img,
                index: idx + 1,
                colSpan: 2,
                rowSpan: 1,
            })),
        ];
    }

    // 4+ images
    return [
        { image: primaryImage.value, index: 0, colSpan: 2, rowSpan: 2 },
        ...secondaryImages.value.slice(0, 2).map((img, idx) => ({
            image: img,
            index: idx + 1,
            colSpan: 1,
            rowSpan: 1,
        })),
        ...(secondaryImages.value.length > 2
            ? [
                  {
                      image: secondaryImages.value[2],
                      index: 3,
                      colSpan: 2,
                      rowSpan: 1,
                  },
              ]
            : []),
    ];
});

async function openFullScreen(index?: number): Promise<void> {
    isFullscreen.value = true;

    if (!index) return;

    selectedImageIndex.value = index;

    await nextTick();

    const element = document.getElementById(`gallery-image-${selectedImageIndex.value}`);

    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
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
});
</script>

<template>
    <!-- No images - show placeholder -->
    <div
        v-if="!images?.length"
        class="flex h-full w-full items-center justify-center rounded-xl bg-gray-100">
        <img :src="placeholder" alt="No images" class="h-24 w-24 opacity-50" />
    </div>

    <!-- Image grid -->
    <div v-else :class="`grid h-full w-full gap-2 overflow-hidden rounded-xl ${gridClasses}`">
        <div
            v-for="item in imageLayout"
            :key="item.index"
            :class="getItemClasses(item)"
            :ref="imageRefs.set"
            @click="openFullScreen(item.index)">
            <img :src="item.image.url" :alt="`Image ${item.index + 1}`" class="gallery-image" />
        </div>
    </div>

    <!-- Fullscreen modal -->
    <Transition name="scale">
        <div class="gallery-fullscreen" v-if="isFullscreen">
            <!-- Header with close and share buttons -->
            <div class="flex items-center justify-between p-4">
                <Button severity="contrast" @click="closeFullscreen" rounded text>
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
                        :key="index"
                        :id="`gallery-image-${index}`"
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

.scale-enter-active,
.scale-leave-active {
    transition: all 0.3s ease;
}

.scale-enter-from {
    opacity: 0;
    transform: scale(0.95);
}

.scale-leave-to {
    opacity: 0;
    transform: scale(0.95);
}
</style>
