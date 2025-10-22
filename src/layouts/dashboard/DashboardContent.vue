<script setup lang="ts"></script>

<template>
    <div class="dashboard-content">
        <slot></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.dashboard-content {
    @apply w-full space-y-4;
    @apply md:space-y-8;
}
</style>
