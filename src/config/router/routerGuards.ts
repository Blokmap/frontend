import { useQueryClient } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import { usePageTitleStore } from '@/composables/store/usePageTitle';
import { useProgress } from '@/composables/store/useProgress';
import { useToast } from '@/composables/store/useToast';
import { pushRedirectUrl, readAuthProfile } from '@/domain/auth';
import {
    readAuthorityMemberPermissions,
    readInstitutionMemberPermissions,
    readLocationMemberPermissions,
} from '@/domain/member';
import { router } from './routerConfig';
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

    // Check for authenticated profile
    const profile = await client.fetchQuery({
        queryKey: ['auth', 'profile'],
        queryFn: readAuthProfile,
        staleTime: 5000,
    });

    if (profile === null) {
        toast.add({
            severity: 'info',
            summary: 'Niet ingelogd',
            detail: 'Log in om deze pagina te bekijken.',
        });

        return { name: 'auth' };
    }

    // Check for admin access
    if (authSettings?.admin && !profile.isAdmin) {
        return { name: 'error.405' };
    }

    // Check for specific permissions (if not admin)
    if (!profile.isAdmin) {
        const locationId = Number(to.params.locationId);
        const institutionId = Number(to.params.institutionId);
        const authorityId = Number(to.params.authorityId);

        const permissionChecks = [
            {
                id: locationId,
                type: 'location' as const,
                queryKey: 'byLocation' as const,
                fn: readLocationMemberPermissions,
                predicate: authSettings.location,
            },
            {
                id: authorityId,
                type: 'authority' as const,
                queryKey: 'byAuthority' as const,
                fn: readAuthorityMemberPermissions,
                predicate: authSettings.authority,
            },
            {
                id: institutionId,
                type: 'institution' as const,
                queryKey: 'byInstitution' as const,
                fn: readInstitutionMemberPermissions,
                predicate: authSettings.institution,
            },
        ];

        for (const check of permissionChecks) {
            if (check.id && check.predicate) {
                try {
                    const permissions = await client.fetchQuery({
                        queryKey: ['permissions', 'list', check.queryKey, check.id, profile.id],
                        queryFn: () => check.fn(check.id, profile.id),
                        staleTime: Infinity,
                    });

                    if (!check.predicate(permissions[check.type])) {
                        return { name: 'error.405' };
                    }
                } catch {
                    return { name: 'error.405' };
                }
            }
        }
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
 * Guard that sets the redirect URL to the new route being navigated to.
 *
 * @param to Route to which we are navigating
 */
export async function redirectRouterGuard(
    to: RouteLocationNormalized,
): Promise<NavigationGuardReturn> {
    if (to.name !== 'auth') pushRedirectUrl(to.fullPath);
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

export function setupRouterGuards(): void {
    const router = useRouter();
    const progressStore = useProgress();

    const progressTimeout = ref<number | null>(null);

    const clearProgress = () => {
        if (progressTimeout.value !== null) {
            clearTimeout(progressTimeout.value);
            progressTimeout.value = null;
        }
        progressStore.finish();
    };

    router.beforeEach(() => {
        progressTimeout.value = window.setTimeout(() => {
            progressStore.start();
            progressTimeout.value = null;
        }, 100);
    });

    router.afterEach(clearProgress);
    router.onError(clearProgress);

    router.beforeEach(authRouterGuard);
    router.afterEach(redirectRouterGuard);
    router.afterEach(titleRouterGuard);
}
