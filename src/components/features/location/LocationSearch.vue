<script setup lang="ts">
import { faMagnifyingGlass, faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineEmits<{
    (e: 'click:search'): void;
}>();
</script>

<template>
    <button @click="$emit('click:search')" class="search-button">
        <div class="flex w-full items-center">
            <FontAwesomeIcon :icon="faMagnifyingGlass" class="search-icon" />
            <span class="search-input">Zoek bloklocaties...</span>
            <FontAwesomeIcon :icon="faFilter" class="search-icon filter-icon" />
        </div>
    </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.search-button {
    @apply bg-primary-50 cursor-pointer rounded-2xl border-none;
    @apply min-w-[280px] px-6 py-3;

    .search-icon {
        @apply text-primary-500;
    }

    .search-input {
        @apply text-primary-800 flex-1 text-sm font-semibold;
    }
}
</style>
