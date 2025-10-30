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
import { authRouterGuard, titleRouterGuard } from './guards';
import {
    AuthPage,
    AuthorityAccessPage,
    AuthorityCreatePage,
    AuthorityIndexPage,
    AuthorityLocationsPage,
    AuthorityMembersPage,
    AuthorityOverviewPage,
    AuthorityRolesPage,
    DashboardReviewsPage,
    DashboardStatisticsPage,
    InstitutionAccessPage,
    InstitutionAuthoritiesPage,
    InstitutionCreatePage,
    InstitutionIndexPage,
    InstitutionMembersPage,
    InstitutionOverviewPage,
    InstitutionRolesPage,
    LocationAccessPage,
    LocationInfoPage,
    LocationOpeningsPage,
    LocationReservationsPage,
    LocationRolesPage,
    LocationScanPage,
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
                        },
                    },
                ],
            },
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
        ],
    },
    {
        path: '/dashboard',
        component: DashboardLayout,
        meta: {
            auth: { required: true },
        },
        children: [
            {
                path: '',
                redirect: { name: 'dashboard.locations.index' },
                name: 'dashboard',
            },
            {
                path: 'locations',
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
                                },
                            },
                            {
                                path: 'scanner',
                                name: 'dashboard.locations.detail.scanner',
                                component: LocationScanPage,
                                props: true,
                                meta: {
                                    title: 'Scanner',
                                },
                            },
                            {
                                path: 'openings',
                                name: 'dashboard.locations.detail.openings',
                                component: LocationOpeningsPage,
                                props: true,
                                meta: {
                                    title: 'Locatie Openingstijden',
                                },
                            },
                            {
                                path: 'access',
                                name: 'dashboard.locations.detail.access',
                                component: LocationAccessPage,
                                props: true,
                                meta: {
                                    title: 'Toegangsbeheer',
                                },
                            },
                            {
                                path: 'roles',
                                name: 'dashboard.locations.detail.roles',
                                component: LocationRolesPage,
                                props: true,
                                meta: {
                                    title: 'Rollen beheren',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                path: 'authorities',
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
                        },
                    },
                    {
                        path: ':authorityId',
                        component: AuthorityDetailLayout,
                        props: true,
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
                            {
                                path: 'access',
                                name: 'dashboard.authorities.detail.access',
                                component: AuthorityAccessPage,
                                props: true,
                                meta: {
                                    title: 'Toegangsbeheer',
                                },
                            },
                            {
                                path: 'roles',
                                name: 'dashboard.authorities.detail.roles',
                                component: AuthorityRolesPage,
                                props: true,
                                meta: {
                                    title: 'Rollen beheren',
                                },
                            },
                        ],
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
                            title: 'Beheer Instituties',
                        },
                    },
                    {
                        path: 'create',
                        name: 'dashboard.institutions.create',
                        component: InstitutionCreatePage,
                        meta: {
                            title: 'Nieuwe Institutie',
                        },
                    },
                    {
                        path: ':institutionId',
                        component: InstitutionDetailLayout,
                        props: true,
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
                            {
                                path: 'access',
                                name: 'dashboard.institutions.detail.access',
                                component: InstitutionAccessPage,
                                props: true,
                                meta: {
                                    title: 'Toegangsbeheer',
                                },
                            },
                            {
                                path: 'roles',
                                name: 'dashboard.institutions.detail.roles',
                                component: InstitutionRolesPage,
                                props: true,
                                meta: {
                                    title: 'Rollen beheren',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                path: 'profiles',
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
                                },
                            },
                            {
                                path: 'locations',
                                name: 'dashboard.profiles.detail.locations',
                                component: ProfileLocationsPage,
                                props: true,
                                meta: {
                                    title: 'Profiel Locaties',
                                },
                            },
                            {
                                path: 'authorities',
                                name: 'dashboard.profiles.detail.authorities',
                                component: ProfileAuthoritiesPage,
                                props: true,
                                meta: {
                                    title: 'Profiel Autoriteiten',
                                },
                            },
                            {
                                path: 'institutions',
                                name: 'dashboard.profiles.detail.institutions',
                                component: ProfileInstitutionsPage,
                                props: true,
                                meta: {
                                    title: 'Profiel Instituties',
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
                },
            },

            {
                path: 'reviews',
                name: 'dashboard.reviews',
                component: DashboardReviewsPage,
                meta: {
                    title: 'Beheer Reviews',
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
    scrollBehavior: (to, from) => {
        if (to.name !== from.name) {
            return { left: 0, top: 0, behavior: 'smooth' };
        }
    },
    routes,
});

router.beforeEach(authRouterGuard);
router.afterEach(titleRouterGuard);

export { router };
