import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Breadcrumbs } from '@/utils/breadcrumb';

export const useBreadcrumbStore = defineStore('breadcrumbs', () => {
    const breadcrumbs = ref<Breadcrumbs>([]);

    function setBreadcrumbs(newBreadcrumbs: Breadcrumbs): void {
        breadcrumbs.value = newBreadcrumbs;
    }

    function clearBreadcrumbs(): void {
        breadcrumbs.value = [];
    }

    return { breadcrumbs, setBreadcrumbs, clearBreadcrumbs };
});
