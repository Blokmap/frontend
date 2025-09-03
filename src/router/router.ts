import { AUTH_QUERY_KEYS } from '@/composables/data/useAuth';
import { useToast } from '@/composables/store/useToast';
import { pullRedirectUrl, pushRedirectUrl } from '@/domain/auth';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import {
    AuthPage,
    DashboardAuthoritiesPage,
    DashboardAuthorityPage,
    DashboardInstitutionPage,
    DashboardInstitutionsPage,
    DashboardLocationPage,
    DashboardLocationsPage,
    DashboardPage,
    LocationPage,
    LocationSubmitPage,
    LocationsPage,
    ProfilePage,
    ReservationsPage,
} from '@/router/pages';
import { getAuthProfile } from '@/services/auth';
import { useQueryClient } from '@tanstack/vue-query';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: 'locations' },
        component: PublicLayout,
        children: [
            {
                path: 'profile',
                meta: { requiresAuth: true },
                children: [
                    {
                        path: '',
                        name: 'profile',
                        component: ProfilePage,
                    },
                    {
                        path: 'reservations/:inWeekOf?',
                        name: 'profile.reservations',
                        component: ReservationsPage,
                    },
                ],
            },
            {
                path: 'locations',
                children: [
                    {
                        path: '',
                        name: 'locations',
                        component: LocationsPage,
                    },
                    {
                        path: ':locationId',
                        name: 'locations.detail',
                        props: true,
                        component: LocationPage,
                    },
                ],
            },
            {
                path: 'locations/submit',
                name: 'locations.submit',
                meta: { requiresAuth: true },
                component: LocationSubmitPage,
            },
        ],
    },
    {
        path: '/dashboard',
        component: DashboardLayout,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: DashboardPage,
            },
            {
                path: '/locations',
                name: 'dashboard.locations',
                children: [
                    {
                        path: '',
                        name: 'dashboard.locations.index',
                        component: DashboardLocationsPage,
                    },
                    {
                        path: ':locationId',
                        name: 'dashboard.locations.detail',
                        props: true,
                        component: DashboardLocationPage,
                    },
                ],
            },
            {
                path: '/authorities',
                name: 'dashboard.authorities',
                children: [
                    {
                        path: '',
                        name: 'dashboard.authorities.index',
                        component: DashboardAuthoritiesPage,
                    },
                    {
                        path: ':authorityId',
                        name: 'dashboard.authorities.detail',
                        props: true,
                        component: DashboardAuthorityPage,
                    },
                ],
            },
            {
                path: '/institutions',
                name: 'dashboard.institutions',
                children: [
                    {
                        path: '',
                        name: 'dashboard.institutions.index',
                        component: DashboardInstitutionsPage,
                    },
                    {
                        path: ':institutionId',
                        name: 'dashboard.institutions.detail',
                        props: true,
                        component: DashboardInstitutionPage,
                    },
                ],
            },
        ],
    },
    {
        path: '/',
        component: AuthLayout,
        children: [
            {
                path: 'auth/sso',
                name: 'auth.sso',
                redirect: () => pullRedirectUrl() || { name: 'profile ' },
            },
            {
                path: 'auth/:action?',
                name: 'auth',
                component: AuthPage,
            },
            {
                path: 'login',
                redirect: { name: 'auth', params: { action: 'login' } },
            },
            {
                path: 'register',
                redirect: { name: 'auth', params: { action: 'register' } },
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ left: 0, top: 0, behavior: 'smooth' }),
    routes,
});

router.beforeEach(async (to) => {
    const client = useQueryClient();

    if (to.meta.requiresAuth) {
        const profile = await client.fetchQuery({
            queryKey: AUTH_QUERY_KEYS.profile(),
            queryFn: getAuthProfile,
        });

        if (profile === null) {
            const toast = useToast();

            toast.add({
                severity: 'info',
                summary: 'Niet ingelogd',
                detail: 'Log in om deze pagina te bekijken.',
            });

            pushRedirectUrl(to.fullPath);

            return { name: 'auth' };
        }
    }
});

export default router;
