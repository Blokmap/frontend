import AuthLayout from '@/layouts/public/AuthLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import OfflinePage from '@/pages/system/OfflinePage.vue';
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
            {
                path: 'auth',
                component: AuthLayout,
                meta: { animate: false },
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
        ],
    },
    {
        path: '/offline',
        name: 'offline',
        component: OfflinePage,
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
