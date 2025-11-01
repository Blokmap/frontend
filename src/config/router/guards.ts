import { useQueryClient } from '@tanstack/vue-query';
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { AUTH_QUERY_KEYS, useAuthProfile } from '@/composables/data/useAuth';
import { usePageTitleStore } from '@/composables/store/usePageTitle';
import { useToast } from '@/composables/store/useToast';
import { pushRedirectUrl, readAuthProfile } from '@/domain/auth';
import { router } from './router';
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
        staleTime: 5000,
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
        // Seamlessly redirect to profile locations page for non-admin users
        if (to.name === 'dashboard.locations.index') {
            return {
                name: 'dashboard.profiles.detail.locations',
                params: { profileId: profile.id },
            };
        }

        toast.add({
            severity: 'error',
            summary: 'Geen toegang',
            detail: 'Je hebt geen toegang tot deze pagina.',
        });

        return { name: 'dashboard' };
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

/**
 * Sets up authentication session expiry guard.
 * Watches for profile changes and redirects to auth page if session expires on protected routes.
 * Call this once in your app's root component (e.g., App.vue).
 */
export function setupAuthGuard(): void {
    const route = useRoute();
    const toast = useToast();

    const { data: profile } = useAuthProfile({
        enabled: computed(() => {
            const authSettings = route.meta.auth;
            return authSettings?.required !== false;
        }),
    });

    // Watch for auth profile changes and redirect if session expires on protected routes
    watch(profile, (newProfile, oldProfile) => {
        const authSettings = route.meta.auth;

        // Only act if profile went from being set to null (session expired)
        if (!oldProfile || !!newProfile) {
            return;
        }

        // Only act if current route requires authentication
        if (!authSettings || authSettings.required === false) {
            return;
        }

        toast.add({
            severity: 'warn',
            summary: 'Sessie verlopen',
            detail: 'Je sessie is verlopen. Log opnieuw in om door te gaan.',
        });

        pushRedirectUrl(route.fullPath);

        router.push({ name: 'auth' });
    });
}
