<script setup lang="ts">
defineProps<{
    hasAdditions?: boolean;
    hasDeletions?: boolean;
}>();
</script>

<template>
    <div class="flex flex-wrap gap-6">
        <div class="legend-item">
            <div class="legend-box bg-slate-100"></div>
            <span class="legend-label">Beschikbaar</span>
        </div>
        <div class="legend-item">
            <div class="legend-box border-secondary-500 bg-secondary-100 border-l-3"></div>
            <span class="legend-label">Jouw reservatie</span>
        </div>
        <div v-if="hasAdditions" class="legend-item">
            <div
                class="legend-box border-secondary-400 bg-secondary-100 border-l-3 border-dashed"></div>
            <span class="legend-label">Nieuw</span>
        </div>
        <div v-if="hasDeletions" class="legend-item">
            <div class="legend-box border-l-3 border-red-700 bg-red-100"></div>
            <span class="legend-label">Verwijderd</span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.legend-item {
    @apply flex items-center gap-2;

    .legend-box {
        @apply h-5 w-5 shrink-0;
    }

    .legend-label {
        @apply text-sm text-gray-700;
    }
}
</style>
