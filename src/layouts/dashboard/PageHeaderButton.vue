<script setup lang="ts">
import Button from 'primevue/button';
import type { ButtonProps } from 'primevue/button';

interface Props extends /* @vue-ignore */ ButtonProps {
    label?: string;
}

const props = defineProps<Props>();
</script>

<template>
    <Button v-bind="$attrs" size="small">
        <span v-if="props.label" class="hidden md:inline">{{ props.label }}</span>
        <slot></slot>
    </Button>
</template>
