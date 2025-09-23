import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ToastServiceMethods } from 'primevue';
import type { ToastMessageOptions } from 'primevue/toast';

export const useToast = defineStore('toast', () => {
    const messages = ref<ToastMessageOptions[]>([]);

    function processQueuedMessages(primeToast: ToastServiceMethods) {
        console.log('Processing queued messages in store', messages.value);

        if (messages.value.length > 0) {
            for (const message of messages.value) {
                primeToast.add(message);
            }
            messages.value = [];
        }
    }

    function add(message: ToastMessageOptions) {
        const withDefaults = {
            life: 5000,
            ...message,
        };

        messages.value.push(withDefaults);
    }

    return {
        messages,
        processQueuedMessages,
        add,
    };
});
