<script lang="ts" setup>
defineProps<{
    for: string;
    value?: string;
}>();
</script>

<template>
    <label :for="for" class="mb-2 block text-sm font-medium text-gray-700">
        <slot v-if="$slots.default || value">{{ value }}</slot>
    </label>
</template>
