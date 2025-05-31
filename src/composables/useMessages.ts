import { useToast, type ToastMessageOptions } from 'primevue';
import { useI18n } from 'vue-i18n';

export type UseMessagesReturn = {
    show: (options: ToastMessageOptions) => void;
};

/**
 * Composable to handle displaying messages using PrimeVue's Toast component.
 *
 * @param {number} life - Duration in milliseconds for which the toast message will be visible. Default is 5000ms.
 * @returns {UseMessagesReturn} Functions to show error, success, and info messages.
 */
export function useMessages(life: number = 5000): UseMessagesReturn {
    const { add } = useToast();
    const { t } = useI18n();

    const show = (options: ToastMessageOptions) => {
        const severity = options.severity || 'info';

        add({
            summary: t(`components.toast.${severity}`),
            severity,
            life,
            ...options,
        });
    };

    return { show };
}
