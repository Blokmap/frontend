<script lang="ts" setup>
defineProps<{
    title?: string;
}>();
</script>

<template>
    <h3 class="sidebar__section-title" v-if="title">{{ title }}</h3>

    <div class="sidebar__nav-group">
        <slot name="default"></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar__nav-group {
    @apply space-y-2;
}

.sidebar__section-title {
    @apply text-xs font-semibold text-slate-400 uppercase;
}
</style>
