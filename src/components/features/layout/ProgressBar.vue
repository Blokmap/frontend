<script setup lang="ts">
import { ref } from 'vue';

const width = defineModel('width', {
    default: 0,
});

const opacity = defineModel('opacity', {
    default: 0,
});

const progressTimer = ref<number | null>(null);

function start() {
    if (progressTimer.value) return;

    let current = 0;
    opacity.value = 1;
    width.value = 0;

    progressTimer.value = window.setInterval(() => {
        if (current < 80) {
            current += (80 - current) / 10 + 0.1;
            width.value = Math.min(current, 80);
        } else {
            clearInterval(progressTimer.value!);
            progressTimer.value = null;
        }
    }, 300);
}

function finish() {
    if (progressTimer.value) {
        clearInterval(progressTimer.value);
        progressTimer.value = null;
    }
    width.value = 100;

    setTimeout(() => {
        opacity.value = 0;

        setTimeout(() => {
            width.value = 0;
        }, 300);
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
    @apply fixed top-0 left-0 z-50 w-full;
    @apply bg-primary h-[2px] transition-all duration-300;
}
</style>
