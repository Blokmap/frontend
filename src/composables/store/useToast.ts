import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ToastServiceMethods } from 'primevue';
import type { ToastMessageOptions } from 'primevue/toast';

export type ToastMessage = ToastMessageOptions & {
    id?: string;
};

const DEFAULT_LIFE = 5000;

export const useToast = defineStore('toast', () => {
    const messages = ref<ToastMessage[]>([]);
    const visible = ref<ToastMessage[]>([]);

    function processQueuedMessages(primeToast: ToastServiceMethods) {
        if (messages.value.length > 0) {
            for (const message of messages.value) {
                primeToast.add(message);

                if (message.id) {
                    visible.value.push(message);

                    // Remove from visible messages after life time
                    const life = message.life ?? DEFAULT_LIFE;

                    setTimeout(() => {
                        const index = visible.value.indexOf(message);

                        if (index > -1) {
                            visible.value.splice(index, 1);
                        }
                    }, life);
                }
            }
            messages.value = [];
        }
    }

    function add(message: ToastMessage) {
        if (visible.value.some((m) => m.id === message.id)) {
            return;
        }

        const withDefaults = {
            life: DEFAULT_LIFE,
            ...message,
        };

        messages.value.push(withDefaults);
    }

    function remove(message: ToastMessage) {
        const messageIndex = messages.value.indexOf(message);
        const visibleIndex = visible.value.indexOf(message);

        if (visibleIndex > -1) {
            visible.value.splice(visibleIndex, 1);
        }

        if (messageIndex > -1) {
            messages.value.splice(messageIndex, 1);
        }
    }

    function hasVisibleToast(id: string): boolean {
        return visible.value.some((toast) => toast.id === id);
    }

    return {
        messages,
        processQueuedMessages,
        add,
        remove,
        hasVisibleToast,
    };
});
