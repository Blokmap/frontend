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
export const LocationImagesPage = () => import('@/pages/manage/locations/LocationImagesPage.vue');
export const LocationSettingsPage = () =>
    import('@/pages/manage/locations/LocationSettingsPage.vue');
export const LocationOpeningsPage = () =>
    import('@/pages/manage/locations/LocationOpeningsPage.vue');
export const LocationReservationsPage = () =>
    import('@/pages/manage/locations/LocationReservationsPage.vue');
export const LocationMembersPage = () => import('@/pages/manage/locations/LocationMembersPage.vue');
export const LocationRolesPage = () => import('@/pages/manage/locations/LocationRolesPage.vue');

// Manage - Authority
export const AuthorityInfoPage = () => import('@/pages/manage/authorities/AuthorityInfoPage.vue');
export const AuthoritySettingsPage = () =>
    import('@/pages/manage/authorities/AuthoritySettingsPage.vue');
export const AuthorityLocationsPage = () =>
    import('@/pages/manage/authorities/AuthorityLocationsPage.vue');
export const AuthorityMembersPage = () =>
    import('@/pages/manage/authorities/AuthorityMembersPage.vue');
export const AuthorityRolesPage = () => import('@/pages/manage/authorities/AuthorityRolesPage.vue');

// Manage - Institution
export const InstitutionInfoPage = () =>
    import('@/pages/manage/institutions/InstitutionInfoPage.vue');
export const InstitutionSettingsPage = () =>
    import('@/pages/manage/institutions/InstitutionSettingsPage.vue');
export const InstitutionAuthoritiesPage = () =>
    import('@/pages/manage/institutions/InstitutionAuthoritiesPage.vue');
export const InstitutionMembersPage = () =>
    import('@/pages/manage/institutions/InstitutionMembersPage.vue');
export const InstitutionLocationsPage = () =>
    import('@/pages/manage/institutions/InstitutionLocationsPage.vue');
export const InstitutionProfilesPage = () =>
    import('@/pages/manage/institutions/InstitutionProfilesPage.vue');
export const InstitutionRolesPage = () =>
    import('@/pages/manage/institutions/InstitutionRolesPage.vue');

// Admin pages
export const LocationIndexPage = () => import('@/pages/admin/LocationIndexPage.vue');
export const AuthorityIndexPage = () => import('@/pages/admin/AuthorityIndexPage.vue');
export const InstitutionIndexPage = () => import('@/pages/admin/InstitutionIndexPage.vue');
export const ProfileIndexPage = () => import('@/pages/admin/ProfileIndexPage.vue');

// Error Pages
export const Error404Page = () => import('@/pages/errors/Error404Page.vue');
export const Error405Page = () => import('@/pages/errors/Error405Page.vue');
