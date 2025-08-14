import { useToast as usePrimeToast } from 'primevue';
import type { ToastMessageOptions } from 'primevue/toast';
import type { ToastServiceMethods } from 'primevue/toastservice';

/**
 * Wrapper around PrimeVue's useToast with a default life of 5000ms.
 * API is the same as PrimeVue's ToastServiceMethods.
 */
export function useToast(): ToastServiceMethods {
    const toast = usePrimeToast();

    return {
        add(message: ToastMessageOptions) {
            const withDefaults: ToastMessageOptions = {
                life: 5000,
                ...message,
            };
            toast.add(withDefaults);
        },
        remove(message: ToastMessageOptions) {
            toast.remove(message);
        },
        removeGroup(group: string) {
            toast.removeGroup(group);
        },
        removeAllGroups() {
            toast.removeAllGroups();
        },
    };
}
