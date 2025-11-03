<script lang="ts" setup>
import { inject, onMounted } from 'vue';

const props = defineProps<{
    class?: string;
    column: string;
}>();

// Register the column with the parent table component
const registerColumn = inject<(column: string) => void>('registerColumn');

onMounted(() => {
    if (registerColumn) {
        registerColumn(props.column);
    }
});
</script>

<template>
    <td :class="['table-cell', props.class]" :data-column="column">
        <div class="cell-label">{{ column }}</div>
        <div class="cell-content">
            <slot></slot>
        </div>
    </td>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.table-cell {
    @apply text-sm;
    @apply block px-0 py-2 whitespace-normal;
    @apply md:table-cell md:px-6 md:py-4 md:whitespace-nowrap;

    .cell-label {
        @apply text-xs font-medium tracking-wider text-slate-500 uppercase;
        @apply mb-2;
        @apply md:hidden;
    }

    .cell-content {
        @apply contents;
    }
}
</style>
