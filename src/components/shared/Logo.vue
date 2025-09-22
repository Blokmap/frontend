<script setup lang="ts">
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import gsap from 'gsap';
import { computed, nextTick, onMounted, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        light?: boolean;
    }>(),
    {
        light: false,
    },
);

const logoRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const sloganRef = ref<HTMLElement | null>(null);

const colorClasses = computed(() => {
    return props.light ? 'text-primary-300' : 'text-primary-500';
});

const sloganColorClasses = computed(() => {
    return props.light ? 'text-primary-100' : 'text-primary-600';
});

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

    // Set initial slogan state
    const sloganLetters = sloganRef.value?.querySelectorAll('span') ?? [];
    gsap.set(sloganLetters, { opacity: 0, y: 15, rotateX: -90 });
});

function handleHoverIn() {
    gsap.to(logoRef.value, {
        y: -10,
        duration: 0.3,
        ease: 'power2.out',
    });

    // Show and animate slogan on hover
    const sloganLetters = sloganRef.value?.querySelectorAll('span') ?? [];
    gsap.to(sloganRef.value, { opacity: 1, duration: 0.2 });
    gsap.to(sloganLetters, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.02,
        duration: 0.5,
        ease: 'power3.out',
    });
}

function handleHoverOut() {
    gsap.to(logoRef.value, {
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
    });

    // Hide slogan when not hovering
    const sloganLetters = sloganRef.value?.querySelectorAll('span') ?? [];
    gsap.to(sloganLetters, {
        opacity: 0,
        y: 15,
        rotateX: -90,
        stagger: 0.01,
        duration: 0.3,
        ease: 'power2.in',
    });
    gsap.to(sloganRef.value, { opacity: 0, duration: 0.3, delay: 0.2 });
}
</script>

<template>
    <div class="relative" @mouseenter="handleHoverIn" @mouseleave="handleHoverOut">
        <div ref="logoRef" class="logo" :class="colorClasses">
            <FontAwesomeIcon :icon="faGraduationCap" class="mr-1" />
            <span ref="textRef">
                <span v-for="(char, i) in 'Blokmap'" :key="i">{{ char }}</span>
            </span>
        </div>
        <div class="slogan" :class="sloganColorClasses" ref="sloganRef">
            <span v-for="(char, i) in 'BlokLocaties Op Kaart Met Aanduidende Pins'" :key="i">
                {{ char === ' ' ? '\u00A0' : char }}
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.logo {
    @apply flex w-fit items-center rounded-full;
    @apply transition-shadow duration-200;
    @apply cursor-pointer text-2xl font-bold tracking-wide select-none;
}

.slogan {
    @apply text-xs font-medium tracking-wide opacity-0;
    @apply absolute top-full left-0 -mt-2 whitespace-nowrap select-none;
    perspective: 1000px;
    span {
        @apply inline-block;
        transform-style: preserve-3d;
    }
}
</style>
