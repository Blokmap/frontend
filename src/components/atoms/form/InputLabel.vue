<script lang="ts" setup>
defineProps<{
    htmlFor?: string;
    value?: string;
    uppercase?: boolean;
}>();
</script>

<template>
    <label :for="htmlFor" :class="['label', { 'label--uppercase': uppercase }]">
        <slot v-if="$slots.default || value">{{ value }}</slot>
    </label>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.label {
    @apply mb-1 block text-sm font-medium text-slate-600;

    &.label--uppercase {
        @apply text-xs font-semibold text-slate-500 uppercase;
    }
}
</style>
