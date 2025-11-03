<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';

defineProps<{
    loading?: boolean;
    empty?: boolean;
}>();
</script>

<template>
    <slot name="loading" v-if="loading">
        <Skeleton></Skeleton>
    </slot>
    <slot name="empty" v-else-if="empty"></slot>
    <div v-else class="flex flex-col gap-4">
        <slot></slot>
    </div>
</template>
