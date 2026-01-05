<script lang="ts" setup>
withDefaults(
    defineProps<{
        size?: 'sm' | 'md' | 'lg';
    }>(),
    {
        size: 'md',
    },
);

const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};
</script>

<template>
    <div class="pulsing-indicator" :class="sizeClasses[size]">
        <span class="pulsing-indicator__content">
            <slot></slot>
        </span>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.pulsing-indicator {
    @apply bg-timber-green-500 rounded-full;
    @apply relative flex items-center justify-center;
    animation: pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

    .pulsing-indicator__content {
        @apply relative z-10 text-xs text-white;
    }

    &::before {
        @apply absolute inset-0 rounded-full content-[''];
        @apply border-timber-green-500 border-2;
        animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
}

@keyframes pulse-green {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.7;
    }
}

@keyframes pulse-ring {
    0% {
        transform: scale(1);
        opacity: 1;
    }
    50%,
    100% {
        transform: scale(1.8);
        opacity: 0;
    }
}
</style>
