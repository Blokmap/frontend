<script lang="ts" setup>
import { faSliders } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import type { LocationSearchFilter } from '@/domain/location';

const props = defineProps<{
    filters: LocationSearchFilter;
}>();

const filterCount = computed<number>(() => {
    const filters = [
        props.filters.openOnDay,
        props.filters.openOnTime,
        props.filters.reservable,
        props.filters.tags,
    ];

    const activeFilters = filters.filter((filter) => {
        const isActive = filter !== null && filter !== undefined;

        if (Array.isArray(filter)) {
            return isActive && filter.length > 0;
        }

        return isActive;
    });

    return activeFilters.length;
});
</script>

<template>
    <div class="filter-button">
        <div class="filter-button__indicator" v-if="filterCount > 0">
            <span>{{ filterCount }}</span>
        </div>
        <FontAwesomeIcon :icon="faSliders" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.filter-button {
    @apply relative cursor-pointer text-lg;

    .filter-button__indicator {
        @apply absolute top-0 right-0 flex h-4 w-4 items-center justify-center;
        @apply translate-x-1/2 -translate-y-1/3;
        @apply bg-primary text-primary-contrast rounded-full text-[9px] font-bold;
    }
}
</style>
