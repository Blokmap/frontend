<script lang="ts" setup></script>

<template>
    <div class="content">
        <slot></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.content {
    @apply mx-auto w-full;
    @apply space-y-6 md:space-y-8;
}
</style>
