<script lang="ts" setup>
defineProps<{
    value?: string;
    invalid?: boolean;
}>();
</script>

<template>
    <small class="mt-1 block" :class="invalid ? 'text-red-600' : 'text-gray-500'">
        <slot v-if="$slots.default || value">
            {{ value }}
        </slot>
    </small>
</template>
