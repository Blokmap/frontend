<script setup lang="ts">
import studying from '@/assets/img/icon/studying.png';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { Profile } from '@/types/schema/Profile';
import {
    faBars,
    faGlobe,
    faMagnifyingGlass,
    faMapLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue';
import { RouterLink } from 'vue-router';

defineProps<{
    profile?: Profile | null;
    profileIsLoading?: boolean;
    logoutIsLoading?: boolean;
}>();

defineEmits<{
    (e: 'logout'): Promise<void>;
}>();

const { filters } = storeToRefs(useLocationFilters());

const searchTemplate = useTemplateRef('search');
const isExpandedSearch = ref(false);

onMounted(() => {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('keydown', handleEscape);
});

/**
 * Toggles the expanded search state.
 * When expanded, it scrolls the search template into view.
 */
function toggleExpandedSearch(state?: boolean) {
    isExpandedSearch.value = state ?? !isExpandedSearch.value;
}

/**
 * Handles click events outside the search template to close the expanded search.
 *
 * @param event - The mouse event triggered by clicking outside the search template.
 */
function handleClickOutside(event: MouseEvent): void {
    toggleExpandedSearch(false);
}

/**
 * Handles the Escape key event to close the expanded search.
 *
 * @param event - The keyboard event triggered by pressing a key.
 */
function handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') toggleExpandedSearch(false);
}
</script>

<template>
    <!-- Public Header -->
    <header
        class="dark:border-surface-800 relative z-10 flex border-b-2 border-slate-200 bg-slate-50 p-4">
        <!-- Wrapper -->
        <div class="relative mx-auto flex w-full justify-center xl:w-10/12">
            <!-- Logo -->
            <h2 class="hidden transform text-sm font-medium sm:absolute sm:top-1 sm:left-0 sm:flex">
                <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
                    <div
                        class="bg-primary text-primary-contrast flex aspect-square items-center gap-2 rounded-full px-3 py-2 font-bold">
                        <FontAwesomeIcon :icon="faMapLocationDot" class="text-md text-primary-200">
                        </FontAwesomeIcon>
                    </div>
                </RouterLink>
            </h2>
            <!-- Search -->
            <div
                ref="search"
                class="relative z-20 flex w-full max-w-[600px] min-w-[350px] origin-top cursor-pointer items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-500 hover:shadow-lg"
                @click.stop="() => toggleExpandedSearch(true)"
                :class="{ 'mt-[4rem] max-w-[960px]': isExpandedSearch }">
                <img :src="studying" class="h-6 w-6" />
                <!-- City filter -->
                <div class="flex items-center gap-2 font-medium text-slate-700">
                    <template v-if="isExpandedSearch">
                        <!-- <InputText v-model="filters.city" placeholder="Stad" /> -->
                    </template>
                    <template v-else>
                        <span>{{ filters.city || 'In de buurt' }}</span>
                    </template>
                </div>

                <div class="h-6 w-px bg-slate-300"></div>

                <!-- Query filter -->
                <div class="flex items-center gap-2 font-medium text-slate-700">
                    <template v-if="isExpandedSearch">
                        <!-- <InputText v-model="filters.query" placeholder="Naam van locatie" /> -->
                    </template>
                    <template v-else>
                        <span>{{ filters.query || 'Alle locaties' }}</span>
                    </template>
                </div>

                <div class="h-6 w-px bg-slate-300"></div>

                <!-- Date filter -->
                <div class="flex items-center gap-2 font-medium text-slate-700">
                    <template v-if="isExpandedSearch">
                        <!-- <Calendar
                            v-model="filters.openOnDay"
                            placeholder="Kies datum"
                            dateFormat="dd/mm/yy"
                            showIcon>
                            </Calendar> -->
                    </template>
                    <template v-else>
                        <span>{{ filters.openOnDay || 'Alle data' }}</span>
                    </template>
                </div>
                <Button class="flex h-8 w-8 items-center overflow-hidden rounded-full">
                    <FontAwesomeIcon :icon="faMagnifyingGlass" />
                </Button>
            </div>
            <!-- Quick Actions -->
            <div
                class="hidden transform items-center gap-2 sm:absolute sm:top-1 sm:right-0 sm:flex">
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
        class="fixed inset-0 z-9 bg-black/40 transition-opacity duration-500"
        :class="{
            'pointer-events-auto opacity-100': isExpandedSearch,
            'pointer-events-none opacity-0': !isExpandedSearch,
        }"
        @click="toggleExpandedSearch(false)"></div>
</template>
