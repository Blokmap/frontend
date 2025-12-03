<script lang="ts" setup>
defineProps<{
    title?: string;
}>();
</script>

<template>
    <h2 class="text-3xl font-extrabold">
        <slot> {{ title }}</slot>
    </h2>
</template>
