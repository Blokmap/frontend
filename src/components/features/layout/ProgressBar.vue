<script setup lang="ts">
import { useProgress } from '@/composables/store/useProgress';

const progressStore = useProgress();
</script>

<template>
    <Transition name="progress-fade">
        <div v-if="progressStore.isLoading" class="progressbar">
            <div class="progressbar__line"></div>
        </div>
    </Transition>
</template>

<style lang="css" scoped>
@reference '@/assets/styles/main.css';

.progressbar {
    @apply fixed top-0 left-0 z-50 h-[2px] w-full;
    @apply overflow-hidden bg-transparent;

    .progressbar__line {
        @apply bg-gradient-conic h-full;
        @apply absolute;
        animation: indeterminate 1.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
    }
}

/* Smooth fade transition */
.progress-fade-enter-active {
    transition: opacity 0.15s ease-out;
}

.progress-fade-leave-active {
    transition: opacity 0.2s ease-in;
}

.progress-fade-enter-from,
.progress-fade-leave-to {
    opacity: 0;
}

@keyframes indeterminate {
    0% {
        left: -35%;
        right: 100%;
    }
    60% {
        left: 100%;
        right: -90%;
    }
    100% {
        left: 100%;
        right: -90%;
    }
}
</style>
