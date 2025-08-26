import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
import AuthLayout from '@/layouts/public/AuthLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: 'locations' },
        component: PublicLayout,
        children: [
            {
                path: 'profile',
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
                        meta: { keepAlive: true },
                        component: () => import('@/pages/locations/LocationsPage.vue'),
                    },
                    {
                        path: ':locationId',
                        name: 'locations.detail',
                        props: true,
                        component: () => import('@/pages/locations/LocationDetailPage.vue'),
                    },
                ],
            },
            {
                path: 'locations/submit',
                name: 'locations.submit',
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

export default router;
