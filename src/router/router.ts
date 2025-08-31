import { AUTH_QUERY_KEYS } from '@/composables/data/useAuth';
import { useToast } from '@/composables/store/useToast';
import AuthLayout from '@/layouts/public/AuthLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
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
                        component: () => import('@/pages/profile/ProfilePage.vue'),
                    },
                    {
                        path: 'reservations/:inWeekOf?',
                        name: 'profile.reservations',
                        component: () => import('@/pages/profile/ReservationsPage.vue'),
                    },
                ],
            },
            {
                path: 'locations',
                children: [
                    {
                        path: '',
                        name: 'locations',
                        component: () => import('@/pages/locations/LocationsPage.vue'),
                    },
                    {
                        path: ':locationId',
                        name: 'locations.detail',
                        props: true,
                        component: () => import('@/pages/locations/LocationPage.vue'),
                    },
                ],
            },
            {
                path: 'locations/submit',
                name: 'locations.submit',
                meta: { requiresAuth: true },
                component: () => import('@/pages/locations/LocationSubmitPage.vue'),
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
                redirect: () => {
                    const storedRedirectUrl = localStorage.getItem('redirectAfterLogin');
                    const redirectPath = storedRedirectUrl || { name: 'profile' };

                    if (storedRedirectUrl) {
                        localStorage.removeItem('redirectAfterLogin');
                    }

                    return redirectPath;
                },
            },
            {
                path: 'auth/:action?',
                name: 'auth',
                component: () => import('@/pages/auth/AuthPage.vue'),
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

            localStorage.setItem('redirectAfterLogin', to.fullPath);

            toast.add({
                severity: 'info',
                summary: 'Niet ingelogd',
                detail: 'Log in om deze pagina te bekijken.',
            });

            return { name: 'auth' };
        }
    }
});

export default router;
