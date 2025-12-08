<script lang="ts" setup>
defineProps<{
    title?: string;
}>();
</script>

<template>
    <div class="wrapper">
        <h2 class="wrapper__title">
            <slot> {{ title }}</slot>
        </h2>
        <div class="wrapper__actions" v-if="$slots.actions">
            <slot name="actions"></slot>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.wrapper {
    @apply flex items-center justify-between gap-3;

    .wrapper__title {
        @apply text-3xl leading-none font-extrabold;
    }

    .wrapper__actions {
        @apply flex items-center gap-2;
    }
}
</style>
