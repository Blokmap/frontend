import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useToast } from '@/composables/store/useToast';
import { pullRedirectUrl } from '@/domain/auth';
import { authRouterGuard, breadcrumbRouterGuard, titleRouterGuard } from './guards';
import {
    AuthPage,
    DashboardAuthoritiesPage,
    DashboardAuthorityPage,
    DashboardInstitutionPage,
    DashboardInstitutionsPage,
    DashboardPage,
    DashboardReviewsPage,
    DashboardStatisticsPage,
    DashboardUsersPage,
    LocationDetailPage,
    LocationPage,
    LocationSubmitPage,
    LocationsIndexPage,
    LocationsPage,
    ProfilePage,
    ReservationsPage,
} from './pages';

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
                        meta: { title: 'Profiel' },
                    },
                    {
                        path: 'reservations/:inWeekOf?',
                        name: 'profile.reservations',
                        component: ReservationsPage,
                        meta: { title: 'Reserveringen' },
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
                        meta: { title: 'Locaties' },
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
                meta: { auth: { required: true }, title: 'Locatie Toevoegen' },
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
                meta: { title: 'Dashboard' },
            },
            {
                path: 'locations',
                name: 'dashboard.locations',
                children: [
                    {
                        path: '',
                        name: 'dashboard.locations.index',
                        component: LocationsIndexPage,
                        meta: { title: 'Locaties Beheer' },
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
                        meta: { title: 'Autorisaties Beheer' },
                    },
                    {
                        path: ':authorityId',
                        name: 'dashboard.authorities.detail',
                        component: DashboardAuthorityPage,
                        meta: { title: 'Autorisatie Beheer' },
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
                        meta: { title: 'Instellingen Beheer' },
                    },
                    {
                        path: ':institutionId',
                        name: 'dashboard.institutions.detail',
                        component: DashboardInstitutionPage,
                        meta: { title: 'Instelling Beheer' },
                    },
                ],
            },
            {
                path: 'profiles',
                name: 'dashboard.profiles',
                children: [],
                meta: { title: 'Profielen Beheer' },
            },
            {
                path: 'statistics',
                name: 'dashboard.statistics',
                component: DashboardStatisticsPage,
                meta: { title: 'Statistieken' },
            },
            {
                path: 'users',
                name: 'dashboard.users',
                component: DashboardUsersPage,
                meta: { title: 'Gebruikers Beheer' },
            },
            {
                path: 'reviews',
                name: 'dashboard.reviews',
                component: DashboardReviewsPage,
                meta: { title: 'Reviews Beheer' },
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
                redirect: () => {
                    const toast = useToast();

                    toast.add({
                        severity: 'success',
                        summary: 'Succesvol ingelogd',
                        detail: 'Je bent succesvol ingelogd via je instelling!',
                    });

                    return pullRedirectUrl() || { name: 'profile' };
                },
            },
            {
                path: 'auth/:action?',
                name: 'auth',
                component: AuthPage,
                meta: { title: 'Inloggen' },
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
router.afterEach(titleRouterGuard);

export { router };
