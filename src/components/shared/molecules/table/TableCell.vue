<script lang="ts" setup>
import { inject, onMounted } from 'vue';

const props = defineProps<{
    class?: string;
    column: string;
}>();

const registerColumn = inject<(column: string) => void>('registerColumn');

onMounted(() => {
    if (registerColumn) {
        registerColumn(props.column);
    }
});
</script>

<template>
    <td :class="['table-cell', $props.class]" :data-column="column">
        <div class="mobile-cell-label">{{ column }}</div>
        <div class="mobile-cell-content">
            <slot></slot>
        </div>
    </td>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.table-cell {
    @apply px-6 py-4 text-sm whitespace-nowrap;

    .mobile-cell-label {
        @apply hidden;
        @apply text-xs font-medium tracking-wider text-slate-500 uppercase;
        @apply mb-2;
    }

    .mobile-cell-content {
        @apply contents;
    }

    /* Mobile styles */
    @media (max-width: 767px) {
        @apply block px-0 py-2 whitespace-normal;

        .mobile-cell-label {
            @apply block;
        }

        .mobile-cell-content {
            @apply block;
        }
    }
}
</style>
