import type { AuthSettings } from '@/domain/auth';
import type { Breadcrumbs } from '@/types/Breadcrumb';

export interface RouteMeta {
    auth?: AuthSettings;
    breadcrumbs?: Breadcrumbs;
    title?: string;
}

declare module 'vue-router' {
    interface RouteMeta {
        auth?: AuthSettings;
        breadcrumbs?: Breadcrumbs;
        title?: string;
    }
}
