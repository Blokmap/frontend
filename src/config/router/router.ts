import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { AUTH_QUERY_KEYS } from '@/composables/data/useAuth';
import { useToast } from '@/composables/store/useToast';
import { getAuthProfile, pullRedirectUrl } from '@/domain/auth';
import { authRouterGuard, breadcrumbRouterGuard, titleRouterGuard } from './guards';
import {
    AuthPage,
    DashboardAuthoritiesPage,
    DashboardAuthorityPage,
    DashboardInstitutionPage,
    DashboardPage,
    DashboardReviewsPage,
    DashboardStatisticsPage,
    InstitutionIndexPage,
    LocationDetailPage,
    LocationPage,
    LocationSubmitPage,
    LocationsIndexPage,
    LocationsPage,
    ProfilePage,
    ProfilesIndexPage,
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
                        meta: {
                            title: 'Profiel',
                            breadcrumbs: [{ label: 'Profiel', to: { name: 'profile' } }],
                        },
                    },
                    {
                        path: 'reservations/:inWeekOf?',
                        name: 'profile.reservations',
                        component: ReservationsPage,
                        meta: {
                            title: 'Reserveringen',
                            breadcrumbs: [
                                { label: 'Profiel', to: { name: 'profile' } },
                                { label: 'Reserveringen', to: { name: 'profile.reservations' } },
                            ],
                        },
                    },
                ],
            },
            {
                path: 'locations',
                meta: {
                    title: 'Locaties',
                    breadcrumbs: [{ label: 'Locaties', to: { name: 'locations' } }],
                },
                children: [
                    {
                        path: '',
                        name: 'locations',
                        component: LocationsPage,
                        meta: {
                            title: 'Locaties',
                            breadcrumbs: [{ label: 'Locaties', to: { name: 'locations' } }],
                        },
                    },
                    {
                        path: ':locationId',
                        name: 'locations.detail',
                        props: true,
                        component: LocationPage,
                        meta: {
                            title: 'Locatie Details',
                            breadcrumbs: [
                                { label: 'Locaties', to: { name: 'locations' } },
                                { label: 'Locatie Details', to: { name: 'locations.detail' } },
                            ],
                        },
                        // Note: breadcrumbs should be updated dynamically by the component to include location name
                    },
                ],
            },
            {
                path: 'locations/submit',
                name: 'locations.submit',
                meta: {
                    auth: { required: true },
                    title: 'Locatie Toevoegen',
                    breadcrumbs: [
                        { label: 'Locaties', to: { name: 'locations' } },
                        { label: 'Locatie Toevoegen', to: { name: 'locations.submit' } },
                    ],
                },
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
                meta: {
                    title: 'Dashboard',
                    breadcrumbs: [{ label: 'Dashboard', to: { name: 'dashboard' } }],
                },
            },
            {
                path: 'locations',
                children: [
                    {
                        path: '',
                        name: 'dashboard.locations.index',
                        component: LocationsIndexPage,
                        meta: {
                            auth: { admin: true },
                            title: 'Beheer Locaties',
                            breadcrumbs: [
                                { label: 'Dashboard', to: { name: 'dashboard' } },
                                { label: 'Locaties', to: { name: 'dashboard.locations.index' } },
                            ],
                        },
                    },
                    {
                        path: ':locationId',
                        name: 'dashboard.locations.detail',
                        component: LocationDetailPage,
                        meta: {
                            title: 'Beheer Locatie',
                            breadcrumbs: [
                                { label: 'Dashboard', to: { name: 'dashboard' } },
                                { label: 'Locaties', to: { name: 'dashboard.locations.index' } },
                                {
                                    label: 'Locatie Details',
                                    to: { name: 'dashboard.locations.detail' },
                                },
                            ],
                        },
                        // Note: breadcrumbs should be updated dynamically by the component to include location name
                    },
                ],
            },
            {
                path: 'authorities',
                name: 'dashboard.authorities',
                meta: {
                    title: 'Beheer Autorisaties',
                    breadcrumbs: [
                        { label: 'Dashboard', to: { name: 'dashboard' } },
                        { label: 'Autoriteiten', to: { name: 'dashboard.authorities.index' } },
                    ],
                },
                children: [
                    {
                        path: '',
                        name: 'dashboard.authorities.index',
                        component: DashboardAuthoritiesPage,
                        meta: {
                            title: 'Beheer Autorisaties',
                            breadcrumbs: [
                                { label: 'Dashboard', to: { name: 'dashboard' } },
                                {
                                    label: 'Autoriteiten',
                                    to: { name: 'dashboard.authorities.index' },
                                },
                            ],
                        },
                    },
                    {
                        path: ':authorityId',
                        name: 'dashboard.authorities.detail',
                        component: DashboardAuthorityPage,
                        meta: {
                            title: 'Beheer Autorisatie',
                            breadcrumbs: [
                                { label: 'Dashboard', to: { name: 'dashboard' } },
                                {
                                    label: 'Autoriteiten',
                                    to: { name: 'dashboard.authorities.index' },
                                },
                                {
                                    label: 'Autoriteit Details',
                                    to: { name: 'dashboard.authorities.detail' },
                                },
                            ],
                        },
                        // Note: breadcrumbs should be updated dynamically by the component to include authority name
                    },
                ],
            },
            {
                path: 'institutions',
                children: [
                    {
                        path: '',
                        name: 'dashboard.institutions.index',
                        component: InstitutionIndexPage,
                        meta: {
                            title: 'Beheer Instellingen',
                            breadcrumbs: [
                                { label: 'Dashboard', to: { name: 'dashboard' } },
                                {
                                    label: 'Instellingen',
                                    to: { name: 'dashboard.institutions.index' },
                                },
                            ],
                        },
                    },
                    {
                        path: ':institutionId',
                        name: 'dashboard.institutions.detail',
                        component: DashboardInstitutionPage,
                        meta: {
                            title: 'Beheer Instelling',
                            breadcrumbs: [
                                { label: 'Dashboard', to: { name: 'dashboard' } },
                                {
                                    label: 'Instituties',
                                    to: { name: 'dashboard.institutions.index' },
                                },
                                {
                                    label: 'Institutie Details',
                                    to: { name: 'dashboard.institutions.detail' },
                                },
                            ],
                        },
                        // Note: breadcrumbs should be updated dynamically by the component to include institution name
                    },
                ],
            },
            {
                path: 'profiles',
                children: [
                    {
                        path: '',
                        name: 'dashboard.profiles.index',
                        component: ProfilesIndexPage,
                        meta: {
                            auth: { admin: true },
                            title: 'Beheer Profielen',
                            breadcrumbs: [
                                { label: 'Dashboard', to: { name: 'dashboard' } },
                                { label: 'Profielen', to: { name: 'dashboard.profiles.index' } },
                            ],
                        },
                    },
                ],
            },
            {
                path: 'statistics',
                name: 'dashboard.statistics',
                component: DashboardStatisticsPage,
                meta: {
                    title: 'Statistieken',
                    breadcrumbs: [
                        { label: 'Dashboard', to: { name: 'dashboard' } },
                        { label: 'Statistieken', to: { name: 'dashboard.statistics' } },
                    ],
                },
            },

            {
                path: 'reviews',
                name: 'dashboard.reviews',
                component: DashboardReviewsPage,
                meta: {
                    title: 'Beheer Reviews',
                    breadcrumbs: [
                        { label: 'Dashboard', to: { name: 'dashboard' } },
                        { label: 'Reviews', to: { name: 'dashboard.reviews' } },
                    ],
                },
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
                        queryKey: AUTH_QUERY_KEYS.profile(),
                        queryFn: getAuthProfile,
                    });

                    if (profile) {
                        toast.add({
                            severity: 'success',
                            summary: 'Succesvol ingelogd',
                            detail: 'Je bent succesvol ingelogd via je instelling!',
                        });

                        return pullRedirectUrl() || { name: 'profile' };
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
                    breadcrumbs: [{ label: 'Inloggen', to: { name: 'auth' } }],
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
