<script lang="ts" setup>
defineProps<{
    class?: string;
}>();
</script>

<template>
    <td :class="['table-cell', $props.class]">
        <slot></slot>
    </td>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.table-cell {
    @apply px-6 py-4 text-sm whitespace-nowrap;
}
</style>
