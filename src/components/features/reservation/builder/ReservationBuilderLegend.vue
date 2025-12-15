<script lang="ts" setup>
defineProps<{
    hasAdditions?: boolean;
    hasDeletions?: boolean;
}>();
</script>

<template>
    <div class="legend">
        <div class="legend__item">
            <div class="legend__box bg-slate-100"></div>
            <span class="legend__label">Beschikbaar</span>
        </div>
        <div class="legend__item">
            <div class="legend__box border-secondary-500 bg-secondary-100 border-l-3"></div>
            <span class="legend__label">Jouw reservatie</span>
        </div>
        <div v-if="hasAdditions" class="legend__item">
            <div
                class="legend__box border-secondary-400 bg-secondary-100 border-l-3 border-dashed"></div>
            <span class="legend__label">Nieuw</span>
        </div>
        <div v-if="hasDeletions" class="legend__item">
            <div class="legend__box border-l-3 border-red-700 bg-red-100"></div>
            <span class="legend__label">Verwijderd</span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.legend {
    @apply flex flex-wrap justify-center gap-6;

    .legend__item {
        @apply flex items-center gap-2;

        .legend__box {
            @apply h-5 w-5 shrink-0;
        }

        .legend__label {
            @apply text-sm text-gray-700;
        }
    }
}
</style>
