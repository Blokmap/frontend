import PublicLayout from '@/layouts/public/PublicLayout.vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

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
                path: 'test',
                name: 'test',
                component: () => import('@/pages/public/HomePage.vue'),
            },
        ],
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
