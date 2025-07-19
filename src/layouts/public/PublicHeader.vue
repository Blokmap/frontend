<script setup lang="ts">
import LanguageSelector from '@/components/features/layout/LanguageSelector.vue';
import MenuButton from '@/components/features/layout/MenuButton.vue';
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import Logo from '@/components/shared/Logo.vue';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Profile } from '@/types/schema/Profile';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

defineProps<{
    profile?: Profile | null;
    profileIsLoading?: boolean;
    logoutIsLoading?: boolean;
}>();

defineEmits<{ (e: 'logout'): Promise<void> }>();

const { push } = useRouter();

const { filters } = storeToRefs(useLocationFilters());
const locationFilters = useLocationFilters();
const isExpandedSearch = ref(false);

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
});

/**
 * Handles the Escape key event to close the expanded search.
 *
 * @param event - The keyboard event triggered by pressing a key.
 */
function handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        event.preventDefault();
        isExpandedSearch.value = false;
    }
}

/**
 * Handles updates to the filters when the search criteria change.
 *
 * @param newFilters - The new filters to apply.
 */
function handleFiltersUpdate(newFilters: Partial<LocationFilter>): void {
    locationFilters.updateFilters(newFilters);
    isExpandedSearch.value = false;
    push({ name: 'locations' });
}
</script>

<template>
    <header class="header">
        <div class="header--wrapper">
            <!-- <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
                <Logo />
            </RouterLink> -->

            <LocationSearch
                v-model:is-expanded-search="isExpandedSearch"
                :filters="filters"
                @update:filters="handleFiltersUpdate">
            </LocationSearch>

            <div class="header--actions">
                <MenuButton />
                <LanguageSelector />
            </div>
        </div>
    </header>
    <div
        class="expanded-backdrop"
        :class="{ expanded: isExpandedSearch }"
        @click="isExpandedSearch = false"></div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.header {
    @apply dark:border-surface-800 relative z-10 flex rounded-xl;

    .header--wrapper {
        @apply relative mx-auto flex w-full items-center justify-center;
    }

    .header--actions {
        @apply hidden transform items-center gap-2 sm:absolute sm:top-1 sm:right-0 sm:flex;
    }
}

.expanded-backdrop {
    @apply fixed inset-0 z-9 bg-black/30 transition-opacity duration-300;
    @apply pointer-events-none opacity-0;

    &.expanded {
        @apply pointer-events-auto opacity-100;
    }
}
</style>
