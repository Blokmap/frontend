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
                        component: () => import('@/pages/public/profile/ProfilePage.vue'),
                    },
                    {
                        path: 'reservations/:inWeekOf?',
                        name: 'profile.reservations',
                        component: () => import('@/pages/public/profile/ReservationsPage.vue'),
                    },
                ],
            },
            {
                path: 'locations',
                name: 'locations',
                meta: { keepAlive: true },
                component: () => import('@/pages/public/locations/LocationsPage.vue'),
            },
            {
                path: 'locations/submit',
                name: 'locations.submit',
                component: () => import('@/pages/public/locations/LocationSubmitPage.vue'),
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
    {
        path: '/dashboard',
        component: DashboardLayout,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/pages/dashboard/DashboardPage.vue'),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
