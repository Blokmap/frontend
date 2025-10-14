import type { AuthSettings } from '@/domain/auth';
import type { Breadcrumbs } from '@/utils/breadcrumb';

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
