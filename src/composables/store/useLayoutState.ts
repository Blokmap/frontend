import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLayoutState = defineStore('layout-state', () => {
    const showFilters = ref<boolean>(false);
    const showSpotlight = ref<boolean>(false);

    return { showFilters, showSpotlight };
});
