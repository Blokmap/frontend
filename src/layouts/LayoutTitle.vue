<script lang="ts" setup>
defineProps<{
    title?: string;
}>();
</script>

<template>
    <h2 class="content__title">
        <slot> {{ title }}</slot>
    </h2>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.content__title {
    @apply text-3xl leading-none font-extrabold;
}
</style>
