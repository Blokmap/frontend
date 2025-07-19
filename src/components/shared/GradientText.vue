<script setup lang="ts">
defineProps<{ text?: string }>();
</script>

<template>
    <span class="text-gradient-conic">
        <slot>{{ text }}</slot>
    </span>
</template>
