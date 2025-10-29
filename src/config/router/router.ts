import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
import AuthorityDetailLayout from '@/layouts/dashboard/details/AuthorityDetailLayout.vue';
import InstitutionDetailLayout from '@/layouts/dashboard/details/InstitutionDetailLayout.vue';
import LocationDetailLayout from '@/layouts/dashboard/details/LocationDetailLayout.vue';
import ProfileDetailLayout from '@/layouts/dashboard/details/ProfileDetailLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { AUTH_QUERY_KEYS } from '@/composables/data/useAuth';
import { useToast } from '@/composables/store/useToast';
import { readAuthProfile, pullRedirectUrl } from '@/domain/auth';
import { authRouterGuard, breadcrumbRouterGuard, titleRouterGuard } from './guards';
import {
    AuthPage,
    AuthorityCreatePage,
    AuthorityIndexPage,
    AuthorityLocationsPage,
    AuthorityMembersPage,
    AuthorityOverviewPage,
    DashboardReviewsPage,
    DashboardStatisticsPage,
    InstitutionCreatePage,
    InstitutionIndexPage,
    InstitutionOverviewPage,
    InstitutionMembersPage,
    InstitutionAuthoritiesPage,
    LocationAccessPage,
    LocationImagesPage,
    LocationInfoPage,
    LocationOpeningsPage,
    LocationReservationsPage,
    LocationRolesPage,
    LocationScanPage,
    LocationSettingsPage,
    LocationPage,
    LocationSubmitPage,
    LocationIndexPage,
    LocationsPage,
    ProfilePage,
    ProfileAuthoritiesPage,
    ProfileLocationsPage,
    ProfileOverviewPage,
    ProfileIndexPage,
    ProfileInstitutionsPage,
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
        meta: {
            auth: { required: true },
            breadcrumbs: [{ label: 'Dashboard', to: { name: 'dashboard' } }],
        },
        children: [
            {
                path: '',
                redirect: { name: 'dashboard.locations.index' },
                name: 'dashboard',
            },
            {
                path: 'locations',
                meta: {
                    breadcrumbs: [{ label: 'Locaties', to: { name: 'dashboard.locations.index' } }],
                },
                children: [
                    {
                        path: '',
                        name: 'dashboard.locations.index',
                        component: LocationIndexPage,
                        meta: {
                            auth: { admin: true },
                            title: 'Beheer Locaties',
                        },
                    },
                    {
                        path: ':locationId',
                        component: LocationDetailLayout,
                        props: true,
                        meta: {
                            breadcrumbs: [
                                {
                                    label: 'Details',
                                    to: { name: 'dashboard.locations.detail.info' },
                                },
                            ],
                        },
                        children: [
                            {
                                path: '',
                                redirect: { name: 'dashboard.locations.detail.info' },
                            },
                            {
                                path: 'info',
                                name: 'dashboard.locations.detail.info',
                                component: LocationInfoPage,
                                props: true,
                                meta: {
                                    title: 'Locatie Informatie',
                                },
                            },
                            {
                                path: 'reservations',
                                name: 'dashboard.locations.detail.reservations',
                                component: LocationReservationsPage,
                                props: true,
                                meta: {
                                    title: 'Locatie Reservaties',
                                    breadcrumbs: [
                                        {
                                            label: 'Reservaties',
                                            to: { name: 'dashboard.locations.detail.reservations' },
                                        },
                                    ],
                                },
                            },
                            {
                                path: 'scanner',
                                name: 'dashboard.locations.detail.scanner',
                                component: LocationScanPage,
                                props: true,
                                meta: {
                                    title: 'Scanner',
                                    breadcrumbs: [
                                        {
                                            label: 'Scanner',
                                            to: { name: 'dashboard.locations.detail.scanner' },
                                        },
                                    ],
                                },
                            },
                            {
                                path: 'openings',
                                name: 'dashboard.locations.detail.openings',
                                component: LocationOpeningsPage,
                                props: true,
                                meta: {
                                    title: 'Locatie Openingstijden',
                                    breadcrumbs: [
                                        {
                                            label: 'Openingstijden',
                                            to: { name: 'dashboard.locations.detail.openings' },
                                        },
                                    ],
                                },
                            },
                            {
                                path: 'images',
                                name: 'dashboard.locations.detail.images',
                                component: LocationImagesPage,
                                props: true,
                                meta: {
                                    title: 'Locatie Afbeeldingen',
                                    breadcrumbs: [
                                        {
                                            label: 'Afbeeldingen',
                                            to: { name: 'dashboard.locations.detail.images' },
                                        },
                                    ],
                                },
                            },
                            {
                                path: 'settings',
                                name: 'dashboard.locations.detail.settings',
                                component: LocationSettingsPage,
                                props: true,
                                meta: {
                                    title: 'Locatie Instellingen',
                                    breadcrumbs: [
                                        {
                                            label: 'Instellingen',
                                            to: { name: 'dashboard.locations.detail.settings' },
                                        },
                                    ],
                                },
                            },
                            {
                                path: 'access',
                                name: 'dashboard.locations.detail.access',
                                component: LocationAccessPage,
                                props: true,
                                meta: {
                                    title: 'Toegangsbeheer',
                                    breadcrumbs: [
                                        {
                                            label: 'Toegangsbeheer',
                                            to: { name: 'dashboard.locations.detail.access' },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                    {
                        path: ':locationId/roles',
                        name: 'dashboard.locations.detail.roles',
                        component: LocationRolesPage,
                        props: true,
                        meta: {
                            title: 'Rollen beheren',
                            breadcrumbs: [
                                { label: 'Locaties', to: { name: 'dashboard.locations.index' } },
                                {
                                    label: 'Details',
                                    to: { name: 'dashboard.locations.detail.info' },
                                },
                                {
                                    label: 'Rollen beheren',
                                    to: { name: 'dashboard.locations.detail.roles' },
                                },
                            ],
                        },
                    },
                ],
            },
            {
                path: 'authorities',
                meta: {
                    breadcrumbs: [
                        { label: 'Autoriteiten', to: { name: 'dashboard.authorities.index' } },
                    ],
                },
                children: [
                    {
                        path: '',
                        name: 'dashboard.authorities.index',
                        component: AuthorityIndexPage,
                        meta: {
                            title: 'Beheer Autoriteiten',
                        },
                    },
                    {
                        path: 'create',
                        name: 'dashboard.authorities.create',
                        component: AuthorityCreatePage,
                        meta: {
                            title: 'Nieuwe Autoriteit',
                            breadcrumbs: [
                                {
                                    label: 'Nieuwe Autoriteit',
                                    to: { name: 'dashboard.authorities.create' },
                                },
                            ],
                        },
                    },
                    {
                        path: ':authorityId',
                        component: AuthorityDetailLayout,
                        props: true,
                        meta: {
                            breadcrumbs: [
                                {
                                    label: 'Details',
                                    to: { name: 'dashboard.authorities.detail.overview' },
                                },
                            ],
                        },
                        children: [
                            {
                                path: '',
                                redirect: { name: 'dashboard.authorities.detail.overview' },
                            },
                            {
                                path: 'overview',
                                name: 'dashboard.authorities.detail.overview',
                                component: AuthorityOverviewPage,
                                props: true,
                                meta: { title: 'Autoriteit Overzicht' },
                            },
                            {
                                path: 'locations',
                                name: 'dashboard.authorities.detail.locations',
                                component: AuthorityLocationsPage,
                                props: true,
                                meta: { title: 'Autoriteit Locaties' },
                            },
                            {
                                path: 'members',
                                name: 'dashboard.authorities.detail.members',
                                component: AuthorityMembersPage,
                                props: true,
                                meta: { title: 'Autoriteit Leden' },
                            },
                        ],
                    },
                ],
            },
            {
                path: 'institutions',
                meta: {
                    breadcrumbs: [
                        { label: 'Instituties', to: { name: 'dashboard.institutions.index' } },
                    ],
                },
                children: [
                    {
                        path: '',
                        name: 'dashboard.institutions.index',
                        component: InstitutionIndexPage,
                        meta: {
                            title: 'Beheer Instituties',
                        },
                    },
                    {
                        path: 'create',
                        name: 'dashboard.institutions.create',
                        component: InstitutionCreatePage,
                        meta: {
                            title: 'Nieuwe Institutie',
                            breadcrumbs: [
                                {
                                    label: 'Nieuwe Institutie',
                                    to: { name: 'dashboard.institutions.create' },
                                },
                            ],
                        },
                    },
                    {
                        path: ':institutionId',
                        component: InstitutionDetailLayout,
                        props: true,
                        meta: {
                            breadcrumbs: [
                                {
                                    label: 'Details',
                                    to: { name: 'dashboard.institutions.detail.overview' },
                                },
                            ],
                        },
                        children: [
                            {
                                path: '',
                                redirect: { name: 'dashboard.institutions.detail.overview' },
                            },
                            {
                                path: 'overview',
                                name: 'dashboard.institutions.detail.overview',
                                component: InstitutionOverviewPage,
                                props: true,
                                meta: { title: 'Institutie Overzicht' },
                            },
                            {
                                path: 'users',
                                name: 'dashboard.institutions.detail.users',
                                component: InstitutionMembersPage,
                                props: true,
                                meta: { title: 'Institutie Leden' },
                            },
                            {
                                path: 'authorities',
                                name: 'dashboard.institutions.detail.authorities',
                                component: InstitutionAuthoritiesPage,
                                props: true,
                                meta: { title: 'Institutie Autoriteiten' },
                            },
                        ],
                    },
                ],
            },
            {
                path: 'profiles',
                meta: {
                    breadcrumbs: [{ label: 'Profielen', to: { name: 'dashboard.profiles.index' } }],
                },
                children: [
                    {
                        path: '',
                        name: 'dashboard.profiles.index',
                        component: ProfileIndexPage,
                        meta: {
                            auth: { admin: true },
                            title: 'Beheer Profielen',
                        },
                    },
                    {
                        path: ':profileId',
                        component: ProfileDetailLayout,
                        props: true,
                        children: [
                            {
                                path: '',
                                redirect: { name: 'dashboard.profiles.detail.overview' },
                            },
                            {
                                path: 'overview',
                                name: 'dashboard.profiles.detail.overview',
                                component: ProfileOverviewPage,
                                props: true,
                                meta: {
                                    title: 'Profiel Overzicht',
                                    breadcrumbs: [
                                        {
                                            label: 'Overzicht',
                                            to: { name: 'dashboard.profiles.detail.overview' },
                                        },
                                    ],
                                },
                            },
                            {
                                path: 'locations',
                                name: 'dashboard.profiles.detail.locations',
                                component: ProfileLocationsPage,
                                props: true,
                                meta: {
                                    title: 'Profiel Locaties',
                                    breadcrumbs: [
                                        {
                                            label: 'Locaties',
                                            to: { name: 'dashboard.profiles.detail.locations' },
                                        },
                                    ],
                                },
                            },
                            {
                                path: 'authorities',
                                name: 'dashboard.profiles.detail.authorities',
                                component: ProfileAuthoritiesPage,
                                props: true,
                                meta: {
                                    title: 'Profiel Autoriteiten',
                                    breadcrumbs: [
                                        {
                                            label: 'Autoriteiten',
                                            to: { name: 'dashboard.profiles.detail.authorities' },
                                        },
                                    ],
                                },
                            },
                            {
                                path: 'institutions',
                                name: 'dashboard.profiles.detail.institutions',
                                component: ProfileInstitutionsPage,
                                props: true,
                                meta: {
                                    title: 'Profiel Instituties',
                                    breadcrumbs: [
                                        {
                                            label: 'Instituties',
                                            to: { name: 'dashboard.profiles.detail.institutions' },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                path: 'statistics',
                name: 'dashboard.statistics',
                component: DashboardStatisticsPage,
                meta: {
                    title: 'Statistieken',
                    breadcrumbs: [{ label: 'Statistieken', to: { name: 'dashboard.statistics' } }],
                },
            },

            {
                path: 'reviews',
                name: 'dashboard.reviews',
                component: DashboardReviewsPage,
                meta: {
                    title: 'Beheer Reviews',
                    breadcrumbs: [{ label: 'Reviews', to: { name: 'dashboard.reviews' } }],
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
                        queryFn: readAuthProfile,
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
