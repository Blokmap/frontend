// Locations
export const LocationsPage = () => import('@/pages/locations/LocationsPage.vue');
export const LocationPage = () => import('@/pages/locations/LocationPage.vue');
export const LocationSubmitPage = () => import('@/pages/locations/LocationSubmitPage.vue');

// Authentication
export const AuthPage = () => import('@/pages/auth/AuthPage.vue');

// Manage - Dashboard
export const ManageDashboardPage = () => import('@/pages/manage/DashboardPage.vue');
export const DashboardLocationsPage = () => import('@/pages/manage/DashboardLocationsPage.vue');

// Manage - Location
export const LocationInfoPage = () => import('@/pages/manage/locations/LocationInfoPage.vue');
export const LocationOpeningsPage = () =>
    import('@/pages/manage/locations/LocationOpeningsPage.vue');
export const LocationReservationsPage = () =>
    import('@/pages/manage/locations/LocationReservationsPage.vue');
export const LocationScannerPage = () => import('@/pages/manage/locations/LocationScannerPage.vue');
export const LocationMembersPage = () => import('@/pages/manage/locations/LocationMembersPage.vue');

// Manage - Authority
export const AuthorityOverviewPage = () =>
    import('@/pages/manage/authorities/AuthorityOverviewPage.vue');
export const AuthorityLocationsPage = () =>
    import('@/pages/manage/authorities/AuthorityLocationsPage.vue');
export const AuthorityMembersPage = () =>
    import('@/pages/manage/authorities/AuthorityMembersPage.vue');

// Manage - Institution
export const InstitutionOverviewPage = () =>
    import('@/pages/manage/institutions/InstitutionOverviewPage.vue');
export const InstitutionAuthoritiesPage = () =>
    import('@/pages/manage/institutions/InstitutionAuthoritiesPage.vue');
export const InstitutionMembersPage = () =>
    import('@/pages/manage/institutions/InstitutionMembersPage.vue');

// Error Pages
export const Error404Page = () => import('@/pages/errors/Error404Page.vue');
export const Error405Page = () => import('@/pages/errors/Error405Page.vue');
