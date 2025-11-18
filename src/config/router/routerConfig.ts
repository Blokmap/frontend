import AuthLayout from '@/layouts/auth/AuthLayout.vue';
import DashboardLayout from '@/layouts/dashboard/DashboardLayout.vue';
import AuthorityDetailLayout from '@/layouts/dashboard/details/AuthorityDetailLayout.vue';
import InstitutionDetailLayout from '@/layouts/dashboard/details/InstitutionDetailLayout.vue';
import LocationDetailLayout from '@/layouts/dashboard/details/LocationDetailLayout.vue';
import ProfileDetailLayout from '@/layouts/dashboard/details/ProfileDetailLayout.vue';
import PublicLayout from '@/layouts/public/PublicLayout.vue';
import TestPage from '@/pages/TestPage.vue';
import { useQueryClient } from '@tanstack/vue-query';
import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useToast } from '@/composables/store/useToast';
import { readAuthProfile, pullRedirectUrl } from '@/domain/auth';
import {
    has,
    blank,
    LocationPermission,
    AuthorityPermission,
    InstitutionPermission,
} from '@/domain/member';
import { authRouterGuard, redirectRouterGuard, titleRouterGuard } from './routerGuards';
import {
    AuthPage,
    AuthorityCreatePage,
    AuthorityIndexPage,
    AuthorityLocationsPage,
    AuthorityMembersPage,
    AuthorityOverviewPage,
    AuthorityRolesPage,
    DashboardReviewsPage,
    DashboardStatisticsPage,
    InstitutionAuthoritiesPage,
    InstitutionCreatePage,
    InstitutionIndexPage,
    InstitutionMembersPage,
    InstitutionOverviewPage,
    InstitutionUsersPage,
    InstitutionRolesPage,
    LocationInfoPage,
    LocationOpeningsPage,
    LocationReservationsPage,
    LocationRolesPage,
    LocationScanPage,
    LocationPage,
    LocationSubmitPage,
    LocationIndexPage,
    LocationsPage,
    ProfileOverviewPage,
    ProfileAuthoritiesPage,
    ProfileLocationsPage,
    ProfileIndexPage,
    ProfileInstitutionsPage,
    LocationMembersPage,
    ReportsIndexPage,
    Error404Page,
    Error405Page,
} from './routerPages';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: { name: 'locations' },
        component: PublicLayout,
        children: [
            {
                path: 'test',
                component: TestPage,
                meta: { auth: { admin: true } },
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
                                    auth: {
                                        location: blank(),
                                    },
                                },
                            },
                            {
                                path: 'reservations',
                                name: 'dashboard.locations.detail.reservations',
                                component: LocationReservationsPage,
                                props: true,
                                meta: {
                                    title: 'Locatie Reservaties',
                                    auth: {
                                        location: has(LocationPermission.ManageReservations),
                                    },
                                },
                            },
                            {
                                path: 'scanner',
                                name: 'dashboard.locations.detail.scanner',
                                component: LocationScanPage,
                                props: true,
                                meta: {
                                    title: 'Scanner',
                                    auth: {
                                        location: has(LocationPermission.ManageReservations),
                                    },
                                },
                            },
                            {
                                path: 'openings',
                                name: 'dashboard.locations.detail.openings',
                                component: LocationOpeningsPage,
                                props: true,
                                meta: {
                                    title: 'Locatie Openingstijden',
                                    auth: {
                                        location: has(LocationPermission.ManageOpeningTimes),
                                    },
                                },
                            },
                            {
                                path: 'members',
                                name: 'dashboard.locations.detail.members',
                                component: LocationMembersPage,
                                props: true,
                                meta: {
                                    title: 'Toegangsbeheer',
                                    auth: {
                                        location: has(LocationPermission.ManageMembers),
                                    },
                                },
                            },
                            {
                                path: 'roles',
                                name: 'dashboard.locations.detail.roles',
                                component: LocationRolesPage,
                                props: true,
                                meta: {
                                    title: 'Rollen beheren',
                                    auth: {
                                        location: has(LocationPermission.ManageMembers),
                                    },
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
                            auth: { admin: true },
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
                                meta: {
                                    title: 'Autoriteit Overzicht',
                                    auth: { authority: blank() },
                                },
                            },
                            {
                                path: 'locations',
                                name: 'dashboard.authorities.detail.locations',
                                component: AuthorityLocationsPage,
                                props: true,
                                meta: {
                                    title: 'Autoriteit Locaties',
                                    auth: { authority: blank() },
                                },
                            },
                            {
                                path: 'members',
                                name: 'dashboard.authorities.detail.members',
                                component: AuthorityMembersPage,
                                props: true,
                                meta: {
                                    title: 'Toegangsbeheer',
                                    auth: { authority: has(AuthorityPermission.ManageMembers) },
                                },
                            },
                            {
                                path: 'roles',
                                name: 'dashboard.authorities.detail.roles',
                                component: AuthorityRolesPage,
                                props: true,
                                meta: {
                                    title: 'Rollen beheren',
                                    auth: { authority: has(AuthorityPermission.ManageMembers) },
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
                            auth: { admin: true },
                        },
                    },
                    {
                        path: 'create',
                        name: 'dashboard.institutions.create',
                        component: InstitutionCreatePage,
                        meta: {
                            title: 'Nieuwe Institutie',
                            auth: { admin: true },
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
                                meta: {
                                    title: 'Institutie Overzicht',
                                    auth: { institution: blank() },
                                },
                            },
                            {
                                path: 'users',
                                name: 'dashboard.institutions.detail.users',
                                component: InstitutionUsersPage,
                                props: true,
                                meta: { title: 'Institutie Leden', auth: { institution: blank() } },
                            },
                            {
                                path: 'authorities',
                                name: 'dashboard.institutions.detail.authorities',
                                component: InstitutionAuthoritiesPage,
                                props: true,
                                meta: {
                                    title: 'Institutie Autoriteiten',
                                    auth: { institution: blank() },
                                },
                            },
                            {
                                path: 'members',
                                name: 'dashboard.institutions.detail.members',
                                component: InstitutionMembersPage,
                                props: true,
                                meta: {
                                    title: 'Toegangsbeheer',
                                    auth: { institution: has(InstitutionPermission.ManageMembers) },
                                },
                            },
                            {
                                path: 'roles',
                                name: 'dashboard.institutions.detail.roles',
                                component: InstitutionRolesPage,
                                props: true,
                                meta: {
                                    title: 'Rollen beheren',
                                    auth: { institution: has(InstitutionPermission.ManageMembers) },
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
                            title: 'Beheer Profielen',
                            auth: { admin: true },
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
                    auth: { admin: true },
                },
            },

            {
                path: 'reviews',
                name: 'dashboard.reviews',
                component: DashboardReviewsPage,
                meta: {
                    title: 'Beheer Reviews',
                    auth: { admin: true },
                },
            },
            {
                path: 'reports',
                name: 'dashboard.reports.index',
                component: ReportsIndexPage,
                meta: {
                    title: 'Meldingen',
                    auth: { admin: true },
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
                                name: 'dashboard.profiles.detail.overview',
                                params: { profileId: profile.id },
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
    scrollBehavior: (to, from) => {
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
