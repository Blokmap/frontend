<script lang="ts" setup>
defineProps<{
    title?: string;
}>();
</script>

<template>
    <aside class="sidebar">
        <slot name="title" v-if="$slots.title || title">
            <h1 class="sidebar__title">{{ title }}</h1>
        </slot>
        <slot name="content" v-if="$slots.content"></slot>
        <nav class="sidebar__nav">
            <slot name="default"></slot>
        </nav>
    </aside>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.sidebar {
    @apply space-y-6 pt-6 lg:pt-0 lg:pr-12;
    @apply border-t-2 border-slate-200 lg:border-t-0 lg:border-r-2;

    .sidebar__title {
        @apply pt-6 text-3xl font-extrabold;
    }

    .sidebar__nav {
        @apply sticky top-6 lg:space-y-2;
    }
}
</style>
