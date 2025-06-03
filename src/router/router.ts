import AuthLayout from '@/layouts/public/AuthLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: PublicLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/pages/public/HomePage.vue'),
            },
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
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
