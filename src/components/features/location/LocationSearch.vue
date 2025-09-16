<template>
    <button @click="$emit('click:search')" class="search-button">
        <FontAwesomeIcon :icon="faMagnifyingGlass" class="search-icon" />
        <span class="search-text">Zoek bloklocaties...</span>
    </button>
</template>

<script setup lang="ts">
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineEmits<{
    (e: 'click:search'): void;
}>();
</script>

<style scoped>
@reference '@/assets/styles/main.css';

.search-button {
    @apply flex items-center gap-3 rounded-full px-6 py-2;
    @apply border border-slate-200 bg-slate-50;
    @apply cursor-pointer transition-all duration-200;

    .search-icon {
        @apply text-lg text-slate-700;
        @apply transition-colors duration-200;
    }

    .search-text {
        @apply font-medium text-slate-700;
        @apply transition-colors duration-200;
    }

    &:hover {
        @apply scale-105;
    }

    &:active {
        @apply scale-97;
    }
}
</style>
