<script setup lang="ts">
const width = defineModel('width', {
    default: 0,
});

const opacity = defineModel('opacity', {
    default: 0,
});

/**
 * Starts the progress bar animation.
 */
function start(): void {
    opacity.value = 1;
    width.value = 80;
}

/**
 * Finishes the progress bar animation.
 * Sets width to 100% and fades out after a delay.
 */
function finish(): void {
    width.value = 100;
    setTimeout(() => {
        opacity.value = 0;
    }, 400);
}

defineExpose({
    start,
    finish,
});
</script>

<template>
    <div class="progressbar" :style="{ width: width + '%', opacity }"></div>
</template>

<style lang="css" scoped>
@reference '@/assets/styles/main.css';

.progressbar {
    @apply fixed top-0 left-0 w-full z-50;
    @apply bg-primary h-1 transition-all duration-300;
}
</style>
