<script setup lang="ts">
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import gsap from 'gsap';
import { nextTick, onMounted, ref } from 'vue';

const logoRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);

onMounted(async () => {
    await nextTick();

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
        rotate: 3,
        duration: 0.3,
        ease: 'power2.out',
    });
}

function handleHoverOut() {
    gsap.to(logoRef.value, {
        scale: 1,
        rotate: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
    });
}
</script>

<template>
    <div ref="logoRef" class="logo" @mouseenter="handleHoverIn" @mouseleave="handleHoverOut">
        <FontAwesomeIcon :icon="faGraduationCap" class="mr-2 text-2xl" />
        <span ref="textRef" class="flex space-x-[1px]">
            <span v-for="(char, i) in 'Blokmap'" :key="i">{{ char }}</span>
        </span>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.logo {
    @apply bg-secondary border-secondary flex h-[46px] items-center rounded-full border-2 px-3 transition-shadow duration-200;
    @apply font-bowlby text-primary-contrast cursor-pointer text-xl font-bold tracking-wide uppercase select-none;
}
</style>
