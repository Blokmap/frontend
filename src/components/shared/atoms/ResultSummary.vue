<script setup lang="ts">
interface Props {
    currentCount?: number | null;
    totalCount?: number | null;
    truncated?: boolean;
    emptyMessage: string;
}

withDefaults(defineProps<Props>(), {
    currentCount: null,
    totalCount: null,
    truncated: false,
});
</script>

<template>
    <p class="text-sm font-normal text-slate-700">
        <template v-if="totalCount">
            {{ currentCount ?? '...' }} van {{ totalCount ?? '...' }}
            <template v-if="truncated">+</template> resultaten getoond.
        </template>
        <template v-else>
            {{ emptyMessage }}
        </template>
    </p>
</template>
