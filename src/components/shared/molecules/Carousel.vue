<script setup lang="ts" generic="T">
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';

const props = defineProps<{
    items: T[];
    showNavigationButtons?: boolean;
    showDots?: boolean;
}>();

const emit = defineEmits<{
    (e: 'change', index: number): void;
}>();

const currentIndex = ref<number>(0);

const currentItem = computed<T>(() => props.items[currentIndex.value]);
const hasMultipleItems = computed<boolean>(() => props.items.length > 1);

function next() {
    if (currentIndex.value < props.items.length - 1) {
        currentIndex.value++;
    } else {
        currentIndex.value = 0;
    }
    emit('change', currentIndex.value);
}

function previous() {
    if (currentIndex.value > 0) {
        currentIndex.value--;
    } else {
        currentIndex.value = props.items.length - 1;
    }
    emit('change', currentIndex.value);
}

function goTo(index: number) {
    currentIndex.value = index;
    emit('change', currentIndex.value);
}
</script>

<template>
    <div class="carousel">
        <div class="carousel__content">
            <slot
                v-if="currentItem"
                :item="currentItem"
                :index="currentIndex"
                :total="items.length"></slot>
        </div>

        <!-- Navigation Buttons -->
        <template v-if="showNavigationButtons && hasMultipleItems">
            <button
                class="carousel__button carousel__button--prev"
                type="button"
                @click.stop="previous"
                aria-label="Previous">
                <FontAwesomeIcon :icon="faChevronLeft" />
            </button>
            <button
                class="carousel__button carousel__button--next"
                type="button"
                @click.stop="next"
                aria-label="Next">
                <FontAwesomeIcon :icon="faChevronRight" />
            </button>
        </template>

        <!-- Dot Indicators -->
        <div v-if="showDots && hasMultipleItems" class="carousel__dots">
            <button
                v-for="(_, index) in items"
                :key="index"
                type="button"
                class="carousel__dot"
                :class="{ 'carousel__dot--active': index === currentIndex }"
                @click.stop="goTo(index)"
                :aria-label="`Go to slide ${index + 1}`"></button>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.carousel {
    @apply relative w-full;
}

.carousel__content {
    @apply relative w-full;
}

.carousel__button {
    @apply absolute top-1/2 z-10 -translate-y-1/2;
    @apply flex h-8 w-8 items-center justify-center;
    @apply rounded-full bg-white/90 text-gray-800 shadow-md transition-all hover:scale-110 hover:bg-white;
}

.carousel__button--prev {
    @apply left-2;
}

.carousel__button--next {
    @apply right-2;
}

.carousel__dots {
    @apply absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5;
}

.carousel__dot {
    @apply h-1.5 w-1.5 rounded-full bg-white/60 transition-all hover:bg-white;
}

.carousel__dot--active {
    @apply w-2 bg-white;
}
</style>
