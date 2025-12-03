<script setup lang="ts">
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineEmits<{
    (e: 'click:search'): void;
}>();
</script>

<template>
    <button @click="$emit('click:search')" class="location-search">
        <div class="location-search__content">
            <div class="location-search__icon-wrapper">
                <FontAwesomeIcon :icon="faMagnifyingGlass" class="location-search__icon" />
            </div>
            <span class="location-search__text">Zoek bloklocaties...</span>
            <!-- <div class="location-search__filter">
                <FontAwesomeIcon :icon="faSliders" class="location-search__filter-icon" />
            </div> -->
        </div>
    </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-search {
    @apply relative w-full md:min-w-[320px];
    @apply cursor-pointer rounded-xl;
    @apply bg-white px-4 py-2;
    @apply shadow-playful;
    @apply transition-all duration-200 ease-out;
    @apply border-3 border-slate-200;
    --shadow-color: var(--color-slate-200);
    --shadow-size: 0.25rem;

    &:active {
        @apply shadow-playful-active;
    }
}

.location-search__content {
    @apply flex w-full items-center gap-2.5;
}

.location-search__icon-wrapper {
    @apply flex items-center justify-center rounded-full;
}

.location-search__icon {
    @apply h-4 w-4 text-slate-600;
}

.location-search__text {
    @apply flex-1 text-sm text-slate-600;
}

.location-search__filter {
    @apply flex h-7 w-7 items-center justify-center rounded-full;
    @apply bg-slate-100 transition-colors duration-150;

    .location-search:hover & {
        @apply bg-slate-200;
    }
}

.location-search__filter-icon {
    @apply h-3.5 w-3.5 text-slate-600;
}
</style>
