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
            <FontAwesomeIcon :icon="faSliders" class="filter-icon" />
        </div>
    </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.search-button {
    @apply px-4 py-2;
    @apply w-full md:min-w-[280px];
    @apply rounded-xl bg-slate-100;
    @apply transition-all duration-150 ease-in-out;
    @apply cursor-pointer text-[15px];
    @apply shadow-playful;
    --shadow-color: rgb(148 163 184 / 0.3);

    &:active {
        @apply shadow-playful-active;
    }

    .search-icon {
        @apply h-4 w-4 text-gray-500;
    }

    .search-input {
        @apply mx-3 flex-1 font-medium text-gray-600;
    }

    .filter-icon {
        @apply h-4 w-4 text-gray-400;
    }
}
</style>
