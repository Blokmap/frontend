<script setup lang="ts">
defineProps<{
    keyLabel?: string;
    value?: string;
}>();
</script>

<template>
    <div class="flex w-full max-w-[500px] items-center gap-2">
        <span class="w-1/2 font-medium whitespace-nowrap text-slate-600">
            <slot name="key">{{ keyLabel }}</slot>
        </span>
        <span class="w-1/2 text-slate-900">
            <slot name="value">{{ value }}</slot>
        </span>
    </div>
</template>
