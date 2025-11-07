<script lang="ts" setup>
defineProps<{
    value?: string;
}>();
</script>

<template>
    <small class="mt-1 block text-gray-500">
        <slot v-if="$slots.default || value">
            {{ value }}
        </slot>
    </small>
</template>
