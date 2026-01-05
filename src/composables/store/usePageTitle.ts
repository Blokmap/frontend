import { defineStore } from 'pinia';
import { ref } from 'vue';
import { PROJECT_NAME } from '@/config';

export const usePageTitleStore = defineStore('pageTitle', () => {
    const pageTitle = ref<string>('');

    function setPageTitle(title: string): void {
        pageTitle.value = title;
        document.title = title ? `${title} - ${PROJECT_NAME}` : PROJECT_NAME;
    }

    function clearPageTitle(): void {
        pageTitle.value = '';
        document.title = PROJECT_NAME;
    }

    return { pageTitle, setPageTitle, clearPageTitle };
});
