import ManageLayout from '@/layouts/manage/ManageLayout.vue';
import AuthLayout from '@/layouts/profile/AuthLayout.vue';
import ProfileLayout from '@/layouts/profile/ProfileLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import TestPage from '@/pages/TestPage.vue';
import LocationsManagePage from '@/pages/manage/locations/LocationsManagePage.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useToast } from '@/composables/store/useToast';
import { readAuthProfile, pullRedirectUrl } from '@/domain/auth';
import { authRouterGuard, redirectRouterGuard, titleRouterGuard } from './routerGuards';
import {
    AuthPage,
    LocationPage,
    LocationSubmitPage,
    LocationsPage,
    Error404Page,
    Error405Page,
} from './routerPages';

const routes: RouteRecordRaw[] = [
    {
        path: '/test',
        component: TestPage,
        meta: { auth: { admin: true } },
    },
    {
        path: '/',
        redirect: { name: 'locations' },
        component: PublicLayout,
        children: [
            {
                path: 'locations',
                meta: {
                    title: 'Locaties',
                },
                children: [
                    {
                        path: '',
                        name: 'locations',
                        component: LocationsPage,
                        meta: {
                            title: 'Locaties',
                        },
                    },
                    {
                        path: ':locationId',
                        name: 'locations.detail',
                        props: true,
                        component: LocationPage,
                        meta: {
                            title: 'Locatie Details',
                        },
                    },
                ],
            },
            {
                path: 'locations/submit',
                name: 'locations.submit',
                meta: {
                    auth: { required: true },
                    title: 'Locatie Toevoegen',
                },
                component: LocationSubmitPage,
            },
            {
                path: 'profile',
                name: 'profile',
                meta: { auth: { required: true } },
                component: ProfileLayout,
                children: [
                    {
                        path: 'about',
                        name: 'profile.about',
                        redirect: { name: 'profile', hash: '#about' },
                    },
                    {
                        path: 'reservations',
                        name: 'profile.reservations',
                        redirect: { name: 'profile', hash: '#reservations' },
                    },
                ],
            },
            {
                path: '/manage',
                name: 'manage',
                component: ManageLayout,
                meta: { auth: { required: true } },
                redirect: { name: 'manage.locations' },
                children: [
                    {
                        path: 'locations',
                        name: 'manage.locations',
                        component: LocationsManagePage,
                    },
                ],
            },
            {
                path: '/admin',
                name: 'admin',
                redirect: { name: 'manage.locations' },
                meta: { auth: { admin: true } },
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
                component: AuthPage,
                beforeEnter: async () => {
                    const toast = useToast();
                    const client = useQueryClient();

                    const profile = await client.fetchQuery({
                        queryKey: ['auth', 'profile'],
                        queryFn: readAuthProfile,
                    });

                    if (profile) {
                        toast.add({
                            severity: 'success',
                            summary: 'Succesvol ingelogd',
                            detail: 'Je bent succesvol ingelogd via je instelling!',
                        });

                        return (
                            pullRedirectUrl() || {
                                name: 'profile',
                            }
                        );
                    }

                    toast.add({
                        severity: 'error',
                        summary: 'Inloggen mislukt',
                        detail: 'Inloggen via je instelling is mislukt, probeer het opnieuw.',
                    });

                    return { name: 'auth' };
                },
            },
            {
                path: 'auth/:action?',
                name: 'auth',
                component: AuthPage,
                meta: {
                    title: 'Inloggen',
                },
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
        path: '/404',
        name: 'error.404',
        component: Error404Page,
        meta: {
            auth: { required: false },
        },
    },
    {
        path: '/405',
        name: 'error.405',
        component: Error405Page,
        meta: {
            auth: { required: false },
        },
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'error.404' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkActiveClass: 'active',
    linkExactActiveClass: 'active--exact',
    scrollBehavior: (to, from) => {
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            };
        }

        if (to.name !== from.name) {
            return { left: 0, top: 0, behavior: 'smooth' };
        }
    },
    routes,
});

router.beforeEach(authRouterGuard);
router.afterEach(redirectRouterGuard);
router.afterEach(titleRouterGuard);

export { router };
