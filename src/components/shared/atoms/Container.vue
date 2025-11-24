<script setup lang="ts"></script>

<template>
    <div class="container">
        <slot></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.container {
    @apply mx-auto max-w-[1420px] 2xl:w-[85vw] 2xl:max-w-[1920px];
    @apply px-3 md:px-6;
}
</style>
