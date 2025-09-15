import { useQueryClient } from '@tanstack/vue-query';

import { AUTH_QUERY_KEYS } from '@/composables/data/useAuth';
import { useBreadcrumbStore } from '@/composables/store/useBreadcrumbs';
import { useToast } from '@/composables/store/useToast';
import { type AuthSettings, pushRedirectUrl } from '@/domain/auth';
import { getAuthProfile } from '@/services/auth';

import type { Breadcrumbs } from '@/types/Breadcrumb';
import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router';

export async function authRouterGuard(to: RouteLocationNormalized): Promise<NavigationGuardReturn> {
    const client = useQueryClient();
    const toast = useToast();

    const authSettings = to.meta.auth as AuthSettings;

    if (authSettings?.required) {
        const profile = await client.fetchQuery({
            queryKey: AUTH_QUERY_KEYS.profile(),
            queryFn: getAuthProfile,
        });

        if (profile === null) {
            toast.add({
                severity: 'info',
                summary: 'Niet ingelogd',
                detail: 'Log in om deze pagina te bekijken.',
            });

            pushRedirectUrl(to.fullPath);

            return { name: 'auth' };
        }

        if (authSettings?.permissions?.admin && !profile.isAdmin) {
            toast.add({
                severity: 'error',
                summary: 'Geen toegang',
                detail: 'Je hebt geen toegang tot deze pagina.',
            });

            return { name: 'dashboard' };
        }
    }
}

export async function breadcrumbRouterGuard(
    to: RouteLocationNormalized,
): Promise<NavigationGuardReturn> {
    const { setBreadcrumbs } = useBreadcrumbStore();

    setBreadcrumbs([]);

    if (to.meta.breadcrumbs) {
        const breadcrumbs = to.meta.breadcrumbs as Breadcrumbs;
        setBreadcrumbs(breadcrumbs);
    }
}
