<script setup lang="ts"></script>

<template>
    <div class="relative">
        <div class="logo">
            <!-- <Stroke class="stroke" /> -->
            <span class="letters">
                <span
                    v-for="(char, i) in 'Blokmap'"
                    :key="i"
                    :style="{ animationDelay: `${0.6 + i * 0.04}s` }">
                    {{ char }}
                </span>
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.logo {
    @apply relative flex w-fit items-center px-3 py-1;
    @apply cursor-pointer font-black tracking-tighter uppercase select-none;
    @apply bg-primary rounded-2xl transition-all hover:scale-105 md:text-3xl;

    .letters {
        @apply text-primary-contrast relative z-10 flex items-center text-2xl;

        span {
            @apply flex opacity-0;
            animation: letter-entrance 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards;
        }
    }

    /* .stroke {
        @apply absolute top-1/2 left-1/2 h-full w-full;
        @apply origin-center -translate-x-1/2 -translate-y-1/2 scale-x-115 scale-y-120;
        @apply pointer-events-none select-none;
    } */
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
