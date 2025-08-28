import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useProgress = defineStore('progress', () => {
    const activeRequests = ref(0);

    const isLoading = computed(() => activeRequests.value > 0);

    function start() {
        activeRequests.value++;
    }

    function finish() {
        activeRequests.value = Math.max(0, activeRequests.value - 1);
    }

    return {
        isLoading,
        start,
        finish,
    };
});
