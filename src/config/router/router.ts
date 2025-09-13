import { authRouterGuard, breadcrumbRouterGuard } from './guards';
import {
    AuthPage,
    DashboardAuthoritiesPage,
    DashboardAuthorityPage,
    DashboardInstitutionPage,
    DashboardInstitutionsPage,
    DashboardPage,
    LocationDetailPage,
    LocationPage,
    LocationSubmitPage,
    LocationsIndexPage,
    LocationsPage,
    ProfilePage,
    ReservationsPage,
} from './pages';
import { pullRedirectUrl } from '@/domain/auth';
import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
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
                meta: { auth: { required: true } },
                children: [
                    {
                        path: '',
                        name: 'profile',
                        component: ProfilePage,
                    },
                    {
                        path: 'reservations/:inWeekOf?',
                        name: 'profile.reservations',
                        component: ReservationsPage,
                    },
                ],
            },
            {
                path: 'locations',
                children: [
                    {
                        path: '',
                        name: 'locations',
                        component: LocationsPage,
                    },
                    {
                        path: ':locationId',
                        name: 'locations.detail',
                        props: true,
                        component: LocationPage,
                    },
                ],
            },
            {
                path: 'locations/submit',
                name: 'locations.submit',
                meta: { auth: { required: true } },
                component: LocationSubmitPage,
            },
        ],
    },
    {
        path: '/dashboard',
        component: DashboardLayout,
        meta: { auth: { required: true } },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: DashboardPage,
            },
            {
                path: 'locations',
                name: 'dashboard.locations',
                children: [
                    {
                        path: '',
                        name: 'dashboard.locations.index',
                        component: LocationsIndexPage,
                    },
                    {
                        path: ':locationId',
                        name: 'dashboard.locations.detail',
                        component: LocationDetailPage,
                    },
                ],
            },
            {
                path: 'authorities',
                name: 'dashboard.authorities',
                children: [
                    {
                        path: '',
                        name: 'dashboard.authorities.index',
                        component: DashboardAuthoritiesPage,
                    },
                    {
                        path: ':authorityId',
                        name: 'dashboard.authorities.detail',
                        component: DashboardAuthorityPage,
                    },
                ],
            },
            {
                path: 'institutions',
                name: 'dashboard.institutions',
                children: [
                    {
                        path: '',
                        name: 'dashboard.institutions.index',
                        component: DashboardInstitutionsPage,
                    },
                    {
                        path: ':institutionId',
                        name: 'dashboard.institutions.detail',
                        component: DashboardInstitutionPage,
                    },
                ],
            },
            {
                path: 'profiles',
                name: 'dashboard.profiles',
                children: [],
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
                redirect: () => pullRedirectUrl() || { name: 'profile' },
            },
            {
                path: 'auth/:action?',
                name: 'auth',
                component: AuthPage,
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
];

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior: () => ({ left: 0, top: 0, behavior: 'smooth' }),
    routes,
});

router.beforeEach(authRouterGuard);
router.afterEach(breadcrumbRouterGuard);

export { router };
