<script setup lang="ts">
import Button from 'primevue/button';
import { computed } from 'vue';
import type { ButtonProps } from 'primevue/button';

interface Props extends /* @vue-ignore */ ButtonProps {
    label?: string;
}

const props = defineProps<Props>();

// If no label is provided we want the button to stay square at all sizes.
// When a label exists, keep the mobile (small) square sizing but allow
// the md+ styles to switch to auto sizing so the label can appear inline.
const computedClasses = computed(() => {
    if (!props.label) return 'aspect-square h-10 w-10';
    return 'aspect-square h-10 w-10 md:aspect-auto md:h-auto md:w-auto';
});
</script>

<template>
    <Button v-bind="$attrs" :class="computedClasses">
        <span v-if="props.label" class="hidden md:inline">{{ props.label }}</span>
        <slot></slot>
    </Button>
</template>
