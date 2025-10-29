import type { AuthSettings } from '@/domain/auth';

export interface RouteMeta {
    auth?: AuthSettings;
    title?: string;
}

declare module 'vue-router' {
    interface RouteMeta {
        auth?: AuthSettings;
        title?: string;
    }
}
