import { AuthenticationGuard } from './guards/auth';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
import AuthLayout from '@/layouts/public/AuthLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import OfflinePage from '@/pages/system/OfflinePage.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { KeepAlive } from 'vue';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: 'locations' },
        component: PublicLayout,
        children: [
            {
                path: 'profile',
                beforeEnter: AuthenticationGuard,
                children: [
                    {
                        path: 'reservations',
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
                path: 'login',
                name: 'auth.login',
                component: () => import('@/pages/auth/LoginPage.vue'),
            },
            {
                path: 'register',
                name: 'auth.register',
                component: () => import('@/pages/auth/RegisterPage.vue'),
            },
        ],
    },
    {
        path: '/dashboard',
        component: DashboardLayout,
        beforeEnter: AuthenticationGuard,
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
