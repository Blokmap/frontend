import { defineStore } from 'pinia';
import { useToast as usePrimeToast } from 'primevue';
import { onMounted, ref } from 'vue';

import type { ToastMessageOptions } from 'primevue/toast';
import type { ToastServiceMethods } from 'primevue/toastservice';

export const useToast = defineStore('toast', () => {
    const messages = ref<ToastMessageOptions[]>([]);
    const primeToast = ref<ToastServiceMethods | null>(null);

    try {
        primeToast.value = usePrimeToast();
    } catch {
        // PrimeVue toast not available yet
    }

    onMounted(() => {
        const toast = primeToast.value;

        if (toast) {
            messages.value.forEach((message) => {
                toast.add(message);
            });
            clear();
        }
    });

    function add(message: ToastMessageOptions) {
        const toast = primeToast.value;
        const withDefaults = {
            life: 5000,
            ...message,
        };

        if (toast) {
            toast.add(withDefaults);
        } else {
            messages.value.push(withDefaults);
        }
    }

    function remove(message: ToastMessageOptions) {
        const toast = primeToast.value;
        if (toast) {
            toast.remove(message);
        }
    }

    function removeGroup(group: string) {
        const toast = primeToast.value;
        if (toast) {
            toast.removeGroup(group);
        }
    }

    function removeAllGroups() {
        const toast = primeToast.value;
        if (toast) {
            toast.removeAllGroups();
        }
    }

    function clear() {
        messages.value = [];
    }

    return {
        messages,
        add,
        remove,
        removeGroup,
        removeAllGroups,
        clear,
    };
});
