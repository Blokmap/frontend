import type { Breadcrumbs } from './breadcrumb';
import type { AuthSettings } from '@/domain/auth';

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
