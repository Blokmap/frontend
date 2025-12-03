import ManageLayout from '@/layouts/manage/ManageLayout.vue';
import ManageAuthorityLayout from '@/layouts/manage/layout/ManageAuthorityLayout.vue';
import ManageDashboardLayout from '@/layouts/manage/layout/ManageDashboardLayout.vue';
import ManageInstitutionLayout from '@/layouts/manage/layout/ManageInstitutionLayout.vue';
import ManageLocationLayout from '@/layouts/manage/layout/ManageLocationLayout.vue';
import ManageAuthoritySidebar from '@/layouts/manage/sidebar/ManageAuthoritySidebar.vue';
import ManageDashboardSidebar from '@/layouts/manage/sidebar/ManageDashboardSidebar.vue';
import ManageInstitutionSidebar from '@/layouts/manage/sidebar/ManageInstitutionSidebar.vue';
import ManageLocationSidebar from '@/layouts/manage/sidebar/ManageLocationSidebar.vue';
import AuthLayout from '@/layouts/profile/AuthLayout.vue';
import ProfileLayout from '@/layouts/profile/ProfileLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import TestPage from '@/pages/TestPage.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useToast } from '@/composables/store/useToast';
import { readAuthProfile, pullRedirectUrl } from '@/domain/auth';
import { blank } from '@/domain/member';
import { authRouterGuard, redirectRouterGuard, titleRouterGuard } from './routerGuards';
import {
    AuthPage,
    LocationPage,
    LocationSubmitPage,
    LocationsPage,
    Error404Page,
    Error405Page,
    // Manage pages
    ManageDashboardPage,
    DashboardLocationsPage,
    LocationInfoPage,
    LocationOpeningsPage,
    LocationReservationsPage,
    LocationScannerPage,
    LocationMembersPage,
    AuthorityOverviewPage,
    AuthorityLocationsPage,
    AuthorityMembersPage,
    InstitutionOverviewPage,
    InstitutionAuthoritiesPage,
    InstitutionMembersPage,
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
                path: 'manage',
                component: ManageLayout,
                meta: {
                    auth: { required: true },
                },
                children: [
                    // Profile-specific routes (with optional profileId for admins)
                    // Dashboard (overview)
                    {
                        path: ':profileId?',
                        name: 'manage',
                        components: {
                            default: ManageDashboardLayout,
                            sidebar: ManageDashboardSidebar,
                        },
                        props: {
                            default: true,
                            sidebar: true,
                        },
                        redirect: (to) => ({
                            name: 'manage.dashboard',
                            params: to.params,
                        }),
                        children: [
                            {
                                path: '',
                                name: 'manage.dashboard',
                                component: ManageDashboardPage,
                            },
                            {
                                path: 'locations',
                                name: 'manage.locations',
                                component: DashboardLocationsPage,
                            },
                        ],
                    },
                    // Single Location management
                    {
                        path: 'location/:locationId',
                        name: 'manage.location',
                        components: {
                            default: ManageLocationLayout,
                            sidebar: ManageLocationSidebar,
                        },
                        props: {
                            default: true,
                            sidebar: true,
                        },
                        meta: {
                            auth: {
                                location: blank(),
                            },
                        },
                        redirect: { name: 'manage.location.info' },
                        children: [
                            {
                                path: 'info',
                                name: 'manage.location.info',
                                component: LocationInfoPage,
                                children: [
                                    {
                                        path: 'info',
                                        name: 'manage.location.info.info',
                                        redirect: (to) => ({
                                            name: 'manage.location.info',
                                            params: to.params,
                                            hash: '#info',
                                        }),
                                    },
                                    {
                                        path: 'images',
                                        name: 'manage.location.info.images',
                                        redirect: (to) => ({
                                            name: 'manage.location.info',
                                            params: to.params,
                                            hash: '#images',
                                        }),
                                    },
                                    {
                                        path: 'settings',
                                        name: 'manage.location.info.settings',
                                        redirect: (to) => ({
                                            name: 'manage.location.info',
                                            params: to.params,
                                            hash: '#settings',
                                        }),
                                    },
                                ],
                            },
                            {
                                path: 'openings',
                                name: 'manage.location.openings',
                                component: LocationOpeningsPage,
                            },
                            {
                                path: 'reservations',
                                name: 'manage.location.reservations',
                                component: LocationReservationsPage,
                            },
                            {
                                path: 'scanner',
                                name: 'manage.location.scanner',
                                component: LocationScannerPage,
                            },
                            {
                                path: 'members',
                                name: 'manage.location.members',
                                component: LocationMembersPage,
                            },
                        ],
                    },
                    // Authority management
                    {
                        path: 'authority/:authorityId',
                        name: 'manage.authority',
                        components: {
                            default: ManageAuthorityLayout,
                            sidebar: ManageAuthoritySidebar,
                        },
                        props: { default: true, sidebar: true },
                        redirect: { name: 'manage.authority.overview' },
                        children: [
                            {
                                path: 'overview',
                                name: 'manage.authority.overview',
                                component: AuthorityOverviewPage,
                            },
                            {
                                path: 'locations',
                                name: 'manage.authority.locations',
                                component: AuthorityLocationsPage,
                            },
                            {
                                path: 'members',
                                name: 'manage.authority.members',
                                component: AuthorityMembersPage,
                            },
                        ],
                    },
                    // Institution management
                    {
                        path: 'institution/:institutionId',
                        name: 'manage.institution',
                        components: {
                            default: ManageInstitutionLayout,
                            sidebar: ManageInstitutionSidebar,
                        },
                        props: { default: true, sidebar: true },
                        redirect: { name: 'manage.institution.overview' },
                        children: [
                            {
                                path: 'overview',
                                name: 'manage.institution.overview',
                                component: InstitutionOverviewPage,
                            },
                            {
                                path: 'authorities',
                                name: 'manage.institution.authorities',
                                component: InstitutionAuthoritiesPage,
                            },
                            {
                                path: 'members',
                                name: 'manage.institution.members',
                                component: InstitutionMembersPage,
                            },
                        ],
                    },
                ],
            },
            {
                path: '/admin',
                name: 'admin',
                redirect: { name: 'manage.profile.locations' },
                meta: { auth: { admin: true } },
            },
            {
                path: '404',
                name: 'error.404',
                component: Error404Page,
            },
            {
                path: '405',
                name: 'error.405',
                component: Error405Page,
            },
        ],
    },
    {
        path: '/auth',
        component: AuthLayout,
        children: [
            {
                path: 'sso',
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
                path: ':action?',
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
        path: '/:pathMatch(.*)*',
        component: PublicLayout,
        children: [
            {
                path: '',
                name: 'error.notFound',
                component: Error404Page,
            },
        ],
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
