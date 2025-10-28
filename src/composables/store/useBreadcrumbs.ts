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

    function addBreadcrumbs(...crumbs: Breadcrumbs): void {
        breadcrumbs.value.concat(crumbs);
    }

    return { breadcrumbs, setBreadcrumbs, clearBreadcrumbs, addBreadcrumbs };
});
