<script lang="ts" setup></script>

<template>
    <div class="content">
        <slot></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.content {
    @apply space-y-8;
}
</style>
