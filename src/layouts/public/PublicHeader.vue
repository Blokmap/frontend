<script setup lang="ts">
import LocationSearch from '@/components/features/location/LocationSearch.vue';
import Logo from '@/components/shared/Logo.vue';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Profile } from '@/types/schema/Profile';
import { faBars, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

defineProps<{
    profile?: Profile | null;
    profileIsLoading?: boolean;
    logoutIsLoading?: boolean;
}>();

defineEmits<{
    (e: 'logout'): Promise<void>;
}>();

const { push } = useRouter();

const { updateFilters } = useLocationFilters();
const { filters } = storeToRefs(useLocationFilters());
const isExpandedSearch = ref(false);

onMounted(() => {
    window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
});

/**
 * Toggles the expanded search state.
 *
 * @param state - Optional boolean to set the expanded state directly.
 */
function toggleExpandedSearch(state?: boolean): void {
    isExpandedSearch.value = state ?? !isExpandedSearch.value;
}

/**
 * Handles the Escape key event to close the expanded search.
 *
 * @param event - The keyboard event triggered by pressing a key.
 */
function handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        event.preventDefault();
        toggleExpandedSearch(false);
    }
}

/**
 * Handles updates to the filters when the search criteria change.
 *
 * @param newFilters - The new filters to apply.
 */
function handleFiltersUpdate(newFilters: Partial<LocationFilter>): void {
    updateFilters(newFilters);
    toggleExpandedSearch(false);
    push({ name: 'locations' });
}
</script>

<template>
    <!-- Public Header -->
    <header class="header">
        <!-- Wrapper -->
        <div class="header--wrapper">
            <!-- Logo -->
            <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
                <Logo />
            </RouterLink>

            <!-- Search -->
            <LocationSearch
                :filters="filters"
                :is-expanded-search="isExpandedSearch"
                @update:filters="handleFiltersUpdate"
                @toggle:expanded="toggleExpandedSearch">
            </LocationSearch>

            <!-- Quick Actions -->
            <div class="header--actions">
                <Button severity="secondary" rounded>
                    <template #icon>
                        <FontAwesomeIcon :icon="faGlobe" />
                    </template>
                </Button>
                <Button severity="secondary" rounded>
                    <template #icon>
                        <FontAwesomeIcon :icon="faBars" />
                    </template>
                </Button>
            </div>
        </div>
    </header>
    <div
        class="expanded-backdrop"
        :class="{
            'pointer-events-auto opacity-100': isExpandedSearch,
            'pointer-events-none opacity-0': !isExpandedSearch,
        }"
        @click="toggleExpandedSearch(false)"></div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.header {
    @apply dark:border-surface-800 relative z-10 m-3 flex rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3;

    .header--wrapper {
        @apply relative mx-auto flex w-full items-center justify-center xl:w-7/8;
    }

    .header--actions {
        @apply hidden transform items-center gap-2 sm:absolute sm:top-1 sm:right-0 sm:flex;
    }
}

.expanded-backdrop {
    @apply fixed inset-0 z-9 bg-black/30 transition-opacity duration-300;
}
</style>
