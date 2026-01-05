<script lang="ts" setup>
import InputLabel from '@/components/atoms/form/InputLabel.vue';

defineProps<{
    label: string;
}>();
</script>

<template>
    <div class="card-field">
        <InputLabel uppercase>{{ label }}</InputLabel>
        <slot></slot>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.card-field {
    @apply block min-w-0;
}
</style>
