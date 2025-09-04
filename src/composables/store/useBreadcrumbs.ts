import type { Breadcrumbs } from '@/types/Breadcrumb';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBreadcrumbStore = defineStore('breadcrumbs', () => {
    const breadcrumbs = ref<Breadcrumbs>([]);

    function setBreadcrumbs(newBreadcrumbs: Breadcrumbs): void {
        breadcrumbs.value = newBreadcrumbs;
    }

    return { breadcrumbs, setBreadcrumbs };
});
