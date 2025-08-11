import { i18n } from '@/config/i18n';
import { type ToastMessageOptions, useToast } from 'primevue';

export type UseMessages = {
    showMessage: (options: ToastMessageOptions) => void;
};

/**
 * Composable to handle displaying messages using PrimeVue's Toast component.
 *
 * @returns { UseMessages } An object with a method to show messages.
 */
export function useMessages(): UseMessages {
    const { add } = useToast();
    const { t } = i18n.global;

    const showMessage = (options: ToastMessageOptions) => {
        const severity = options.severity || 'info';
        const life = options.life || 5000;

        add({
            summary: t(`components.toast.${severity}`),
            severity,
            life,
            ...options,
        });
    };

    return { showMessage };
}
