import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useProgress = defineStore('progress', () => {
    const activeRequests = ref(0);

    const isLoading = computed(() => activeRequests.value > 0);

    function start() {
        activeRequests.value++;
    }

    function finish() {
        activeRequests.value = 0;
    }

    return {
        isLoading,
        start,
        finish,
    };
});
