<script setup lang="ts">
defineProps<{ text: string }>();
</script>

<template>
    <span class="emphasis">
        {{ text }}
    </span>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.emphasis {
    @apply from-primary to-secondary bg-gradient-to-r bg-clip-text font-semibold text-transparent;
}
</style>
