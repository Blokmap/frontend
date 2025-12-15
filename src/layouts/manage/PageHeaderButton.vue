<script setup lang="ts">
import Button from 'primevue/button';
import type { ButtonProps } from 'primevue/button';

interface Props extends /* @vue-ignore */ ButtonProps {
    label?: string;
}

const props = defineProps<Props>();
</script>

<template>
    <Button
        v-bind="$attrs"
        class="page-header-btn"
        :class="{ 'page-header-btn--icon-only': !props.label }">
        <slot></slot>
        <span v-if="props.label" class="page-header-btn__label">{{ props.label }}</span>
    </Button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.page-header-btn {
    @apply h-8 w-8 text-xs;

    &:not(.page-header-btn--icon-only) {
        @apply md:h-auto md:w-auto md:text-base;
    }

    &.page-header-btn--icon-only {
        @apply h-8 w-8 md:h-10 md:w-10 md:text-base;
    }

    :deep(.page-header-btn__label) {
        @apply hidden md:inline;
    }
}
</style>
