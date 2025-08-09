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
                        path: 'reservations/:dateInWeek?',
                        name: 'profile.reservations',
                        component: () => import('@/pages/public/profile/ReservationsPage.vue'),
                    },
                ],
            },
            {
                path: 'locations',
                name: 'locations',
                meta: { keepAlive: true },
                component: () => import('@/pages/public/LocationsPage.vue'),
            },
        ],
    },
    {
        path: '/',
        component: AuthLayout,
        children: [
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
