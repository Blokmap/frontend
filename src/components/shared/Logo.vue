<script setup lang="ts">
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import gsap from 'gsap';
import { computed, nextTick, onMounted, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        light?: boolean;
        showSubtitle?: boolean;
    }>(),
    {
        light: false,
        showSubtitle: true,
    },
);

const logoRef = ref<HTMLElement | null>(null);
const textRef = ref<HTMLElement | null>(null);
const subtitleRef = ref<HTMLElement | null>(null);

const colorClasses = computed(() => {
    return props.light ? 'text-primary-300' : 'text-primary-500';
});

const subtitleColorClasses = computed(() => {
    return props.light ? 'text-primary-200' : 'text-primary-600';
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

    // Set initial subtitle state - just hidden
    if (subtitleRef.value) {
        gsap.set(subtitleRef.value, { opacity: 0 });
    }
});

function handleHoverIn() {
    gsap.to(logoRef.value, {
        y: -10,
        duration: 0.3,
        ease: 'power2.out',
    });

    // Simple fade in for subtitle
    if (subtitleRef.value) {
        gsap.to(subtitleRef.value, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    }
}

function handleHoverOut() {
    gsap.to(logoRef.value, {
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.4)',
    });

    // Simple fade out for subtitle
    if (subtitleRef.value) {
        gsap.to(subtitleRef.value, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
        });
    }
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
        <div
            v-if="showSubtitle"
            ref="subtitleRef"
            class="subtitle"
            :class="subtitleColorClasses">
            BlokLocaties Op Kaart Met Aanduidende Pins
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

.subtitle {
    @apply text-xs font-medium tracking-wide;
    @apply absolute top-full left-0 -mt-1 whitespace-nowrap select-none;
}
</style>
