<script lang="ts" setup>
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';

export interface BreadcrumbItem {
    label?: string | null;
    to?: RouteLocationRaw;
}

const props = defineProps<{
    items: BreadcrumbItem[];
    profileId?: string;
}>();

const homeRoute = computed<RouteLocationRaw>(() => {
    if (props.profileId) {
        return { name: 'manage.dashboard', params: { profileId: props.profileId } };
    }

    return { name: 'manage.dashboard' };
});
</script>

<template>
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb__list">
            <li class="breadcrumb__item">
                <RouterLink :to="homeRoute" class="breadcrumb__link">
                    <FontAwesomeIcon :icon="faHome" class="breadcrumb__icon" />
                    <span class="sr-only">Beheer</span>
                </RouterLink>
            </li>
            <li v-for="(item, index) in items" :key="index" class="breadcrumb__item">
                <FontAwesomeIcon :icon="faChevronRight" class="breadcrumb__separator" />
                <RouterLink
                    v-if="item.to && index < items.length - 1"
                    :to="item.to"
                    class="breadcrumb__link">
                    {{ item.label }}
                </RouterLink>
                <span v-else class="breadcrumb__current" aria-current="page">
                    {{ item.label }}
                </span>
            </li>
        </ol>
    </nav>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.breadcrumb__list {
    @apply flex items-center gap-2;
    @apply overflow-hidden;
}

.breadcrumb__item {
    @apply flex shrink-0 items-center gap-2;
    @apply min-w-0;
}

.breadcrumb__item:last-child {
    @apply min-w-0 flex-1;
}

.breadcrumb__link {
    @apply text-slate-500 transition-colors hover:text-slate-900;
    @apply truncate;
}

.breadcrumb__icon {
    @apply shrink-0 text-slate-400;
}

.breadcrumb__separator {
    @apply shrink-0 text-xs text-slate-300;
}

.breadcrumb__current {
    @apply font-medium text-slate-900;
    @apply truncate;
}
</style>
