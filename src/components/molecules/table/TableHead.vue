<script lang="ts" setup>
defineProps<{
    class?: string;
}>();
</script>

<template>
    <th :class="['table-header-cell', $props.class]">
        <slot />
    </th>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.table-header-cell {
    @apply px-6 py-3 text-left text-xs font-medium;
    @apply tracking-wider text-slate-500 uppercase;
}
</style>
