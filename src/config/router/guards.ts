import { useQueryClient } from '@tanstack/vue-query';
import { AUTH_QUERY_KEYS } from '@/composables/data/useAuth';
import { useBreadcrumbStore } from '@/composables/store/useBreadcrumbs';
import { usePageTitleStore } from '@/composables/store/usePageTitle';
import { useToast } from '@/composables/store/useToast';
import { pushRedirectUrl, readAuthProfile } from '@/domain/auth';
import type { Breadcrumbs } from '@/utils/breadcrumb';
import type { NavigationGuardReturn, RouteLocationNormalized } from 'vue-router';

/**
 * Guard that checks if the user is authenticated and has the required permissions.
 *
 * @param to Route to which we are navigating
 */
export async function authRouterGuard(to: RouteLocationNormalized): Promise<NavigationGuardReturn> {
    const client = useQueryClient();
    const toast = useToast();

    const authSettings = to.meta.auth;

    if (!authSettings || authSettings.required === false) {
        return;
    }

    const profile = await client.fetchQuery({
        queryKey: AUTH_QUERY_KEYS.profile(),
        queryFn: readAuthProfile,
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

    if (authSettings?.admin && !profile.isAdmin) {
        toast.add({
            severity: 'error',
            summary: 'Geen toegang',
            detail: 'Je hebt geen toegang tot deze pagina.',
        });

        return { name: 'dashboard' };
    }
}

/**
 * Guard that configures the breadcrumb store based on the route meta.
 *
 * @param to Route to which we are navigating
 */
export async function breadcrumbRouterGuard(
    to: RouteLocationNormalized,
): Promise<NavigationGuardReturn> {
    const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbStore();

    if (to.meta.breadcrumbs) {
        const breadcrumbs = to.meta.breadcrumbs as Breadcrumbs;
        setBreadcrumbs(breadcrumbs);
    } else {
        clearBreadcrumbs();
    }
}

/**
 * Guard that configures the page title store based on the route meta.
 *
 * @param to Route to which we are navigating
 */
export async function titleRouterGuard(
    to: RouteLocationNormalized,
): Promise<NavigationGuardReturn> {
    const { setPageTitle, clearPageTitle } = usePageTitleStore();

    if (to.meta.title) {
        setPageTitle(to.meta.title);
    } else {
        clearPageTitle();
    }
}
