import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLayoutState = defineStore('layout-state', () => {
    const showFiltersDialog = ref<boolean>(false);
    const showSearchSpotlight = ref<boolean>(false);

    return { showFiltersDialog, showSearchSpotlight };
});
