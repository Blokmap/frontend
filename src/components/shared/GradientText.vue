<script setup lang="ts">
defineProps<{ text?: string }>();
</script>

<template>
    <span class="emphasis">
        <slot>{{ text }}</slot>
    </span>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.emphasis {
    font-weight: 600;
    background-image: conic-gradient(
        from 180deg,
        var(--color-primary-500),
        var(--color-secondary-500),
        var(--color-primary-500)
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}
</style>
