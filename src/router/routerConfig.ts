import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/pages/BlokMapPage.vue'),
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/pages/TestPage.vue'),
    },
];

export const RouterPlugin = createRouter({
    history: createWebHistory(),
    routes,
});
