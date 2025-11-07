<script lang="ts" setup>
defineProps<{
    htmlFor: string;
    value?: string;
}>();
</script>

<template>
    <label :for="htmlFor" class="mb-2 block text-sm font-medium text-gray-700">
        <slot v-if="$slots.default || value">{{ value }}</slot>
    </label>
</template>
