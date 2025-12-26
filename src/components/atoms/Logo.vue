<script setup lang="ts">
import { computed } from 'vue';

const variantClasses = computed(() => {
    return 'bg-primary text-primary-contrast shadow-playful';
});
</script>

<template>
    <div class="relative">
        <div class="logo" :class="variantClasses">
            <span class="letters">
                <span
                    v-for="(char, i) in 'Blokmap'"
                    :key="i"
                    :style="{ animationDelay: `${0.6 + i * 0.04}s` }"
                    >{{ char }}</span
                >
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.logo {
    @apply flex w-fit items-center rounded-lg px-2 py-1;
    @apply cursor-pointer font-black tracking-tight uppercase select-none;
    @apply text-2xl md:text-3xl;
    @apply transition-all duration-300;

    --shadow-color: var(--color-primary-600);

    animation: logo-entrance 0.6s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;

    @apply opacity-0;

    &:hover {
        @apply scale-110;
    }

    .letters {
        @apply flex items-center;

        span {
            @apply flex opacity-0;
            animation: letter-entrance 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
    }
}

@keyframes logo-entrance {
    from {
        opacity: 0;
        transform: translateY(-1.25rem) scale(0.8);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes letter-entrance {
    from {
        opacity: 0;
        transform: translateY(0.625rem);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
