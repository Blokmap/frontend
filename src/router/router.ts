import { AuthenticationGuard } from './guards/auth';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
import AuthLayout from '@/layouts/public/AuthLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import OfflinePage from '@/pages/system/OfflinePage.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: 'locations' },
        component: PublicLayout,
        children: [
            {
                path: 'locations',
                name: 'locations',
                component: () => import('@/pages/public/LocationsPage.vue'),
            },
        ],
    },
    {
        path: '/auth/',
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

router.beforeEach(() => {
    const fiters = useQueryClient();
    console.log('User before each route:', fiters.getQueryData(['profile']));
    return true;
});

export default router;
