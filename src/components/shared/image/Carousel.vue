<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted, useTemplateRef } from 'vue';

const { speed = 50 } = defineProps<{
    speed?: number;
}>();

const trackRef = useTemplateRef('track');

async function setupCarousel(): Promise<void> {
    const track = trackRef.value;
    if (!track) return;

    // Get original items
    const items: HTMLElement[] = Array.from(track.querySelectorAll(':not(.duplicate)'));

    // Remove existing duplicates
    track.querySelectorAll('.duplicate').forEach((el) => el.remove());

    // Add enough duplicates to cover any screen size
    const duplicatesNeeded = Math.max(1, Math.ceil(window.innerWidth / 200));

    for (let i = 0; i < duplicatesNeeded; i++) {
        items.forEach((item, j) => {
            const clone = item.cloneNode(true) as HTMLElement;
            clone.classList.add('duplicate');
            clone.classList.add(`${i}-${j}`);
            track.appendChild(clone);
        });
    }

    await nextTick();

    // Calculate width of one complete set
    const itemWidth = items.reduce((total, item) => total + item.offsetWidth, 0);
    const gapsWidth = 32 * items.length; // gap-8 = 32px
    const setWidth = itemWidth + gapsWidth;

    // Set starting position to show first set
    track.style.transform = `translateX(-${setWidth}px)`;

    // Animate from second set back to first set position
    track.style.setProperty('--scroll-width', `${setWidth}px`);
    track.style.setProperty('--duration', `${setWidth / speed}s`);
}

onMounted(async () => {
    setupCarousel();
    window.addEventListener('resize', setupCarousel);
});

onUnmounted(() => {
    window.removeEventListener('resize', setupCarousel);
});
</script>

<template>
    <div class="carousel">
        <div ref="track" class="track">
            <slot />
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.carousel {
    @apply relative w-full overflow-hidden;

    .track {
        @apply flex items-center justify-between gap-8 will-change-transform;
        animation: scroll-left var(--duration, 20s) linear infinite;

        & > * {
            @apply w-[15%] min-w-18 flex-shrink-0;
        }
    }

    &::before,
    &::after {
        content: '';
        @apply pointer-events-none absolute top-0 z-20 h-full w-5;
    }

    &::before {
        @apply left-0;
        background: linear-gradient(to right, var(--color-slate-900), transparent);
    }

    &::after {
        @apply right-0;
        background: linear-gradient(to left, var(--color-slate-900), transparent);
    }
}

@keyframes scroll-left {
    0% {
        transform: translateX(calc(-1 * var(--scroll-width, 100%)));
    }
    100% {
        transform: translateX(calc(-2 * var(--scroll-width, 100%)));
    }
}
</style>
