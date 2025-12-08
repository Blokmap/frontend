<script setup lang="ts">
import gsap from 'gsap';
import { computed, onMounted, ref } from 'vue';

const logoRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);

const variantClasses = computed(() => {
    return 'bg-primary text-primary-contrast shadow-playful';
});

onMounted(async () => {
    const letters = textRef.value?.querySelectorAll('span') ?? [];

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
        logoRef.value,
        { opacity: 0, y: -20, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6 },
    );

    tl.fromTo(
        letters,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.4 },
        '-=0.2',
    );
});

function handleHoverIn() {
    gsap.to(logoRef.value, {
        scale: 1.1,
        duration: 0.3,
        ease: 'power2.out',
    });
}

function handleHoverOut() {
    gsap.to(logoRef.value, {
        scale: 1,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
    });
}
</script>

<template>
    <div class="relative" @mouseenter="handleHoverIn" @mouseleave="handleHoverOut">
        <div ref="logoRef" class="logo" :class="variantClasses">
            <span class="letters" ref="textRef">
                <span v-for="(char, i) in 'Blokmap'" :key="i">{{ char }}</span>
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.logo {
    @apply font-[Armageda];
    @apply flex w-fit items-center rounded-lg px-2 py-1;
    @apply cursor-pointer font-black tracking-tight uppercase select-none;
    @apply text-2xl md:text-3xl;
    @apply transition-shadow duration-200;

    --shadow-color: var(--color-primary-600);

    .letters {
        @apply translate-y-1;
    }
}
</style>
