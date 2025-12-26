<script lang="ts" setup>
defineProps<{
    htmlFor?: string;
    value?: string;
    uppercase?: boolean;
}>();
</script>

<template>
    <label
        :for="htmlFor"
        class="mb-2 block text-sm font-medium"
        :class="uppercase ? 'text-xs font-semibold text-gray-500 uppercase' : 'text-gray-700'">
        <slot v-if="$slots.default || value">{{ value }}</slot>
    </label>
</template>
