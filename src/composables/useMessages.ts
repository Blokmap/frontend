import { useToast } from 'primevue';
import { useI18n } from 'vue-i18n';

export function useMessages() {
    const { add } = useToast();
    const { t } = useI18n();

    const life = 5000;

    const showError = (message: string) => {
        add({
            severity: 'error',
            summary: t('components.toast.error'),
            detail: message,
            life,
        });
    };

    const showSuccess = (message: string) => {
        add({
            severity: 'success',
            summary: t('components.toast.success'),
            detail: message,
            life,
        });
    };

    const showInfo = (message: string) => {
        add({
            severity: 'info',
            summary: t('components.toast.info'),
            detail: message,
            life,
        });
    };

    return { showError, showSuccess, showInfo };
}
