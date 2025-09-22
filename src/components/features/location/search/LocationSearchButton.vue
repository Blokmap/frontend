<script setup lang="ts">
import { faMagnifyingGlass, faSliders } from '@fortawesome/free-solid-svg-icons';
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
            <FontAwesomeIcon :icon="faSliders" class="search-icon filter-icon" />
        </div>
    </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.search-button {
    @apply min-w-[280px] px-6 py-3;
    @apply bg-primary-100/50 border-primary-100 rounded-2xl border;
    @apply transition-transform hover:scale-105;
    @apply cursor-pointer text-[15px];

    .search-icon {
        @apply text-primary-800;
    }

    .search-input {
        @apply text-primary-800 flex-1 font-semibold;
    }
}
</style>
