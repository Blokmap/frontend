// Locations
export const LocationsPage = () =>
    import('@/components/organisms/pages/locations/LocationsPage.vue');
export const LocationPage = () => import('@/components/organisms/pages/locations/LocationPage.vue');
export const LocationSubmitPage = () =>
    import('@/components/organisms/pages/locations/LocationSubmitPage.vue');

// Authentication
export const AuthPage = () => import('@/components/organisms/pages/auth/AuthPage.vue');

// Manage - Dashboard
export const ManageDashboardPage = () =>
    import('@/components/organisms/pages/manage/DashboardPage.vue');
export const DashboardLocationsPage = () =>
    import('@/components/organisms/pages/manage/DashboardLocationsPage.vue');

// Manage - Location
export const LocationOpeningsPage = () =>
    import('@/components/organisms/pages/manage/locations/LocationOpeningsPage.vue');
export const LocationReservationsPage = () =>
    import('@/components/organisms/pages/manage/locations/LocationReservationsPage.vue');
export const LocationMembersPage = () =>
    import('@/components/organisms/pages/manage/locations/LocationMembersPage.vue');
export const LocationRolesPage = () =>
    import('@/components/organisms/pages/manage/locations/LocationRolesPage.vue');

// Manage - Authority
export const AuthorityInfoPage = () =>
    import('@/components/organisms/pages/manage/authorities/AuthorityInfoPage.vue');
export const AuthoritySettingsPage = () =>
    import('@/components/organisms/pages/manage/authorities/AuthoritySettingsPage.vue');
export const AuthorityLocationsPage = () =>
    import('@/components/organisms/pages/manage/authorities/AuthorityLocationsPage.vue');
export const AuthorityMembersPage = () =>
    import('@/components/organisms/pages/manage/authorities/AuthorityMembersPage.vue');
export const AuthorityRolesPage = () =>
    import('@/components/organisms/pages/manage/authorities/AuthorityRolesPage.vue');

// Manage - Institution
export const InstitutionInfoPage = () =>
    import('@/components/organisms/pages/manage/institutions/InstitutionInfoPage.vue');
export const InstitutionSettingsPage = () =>
    import('@/components/organisms/pages/manage/institutions/InstitutionSettingsPage.vue');
export const InstitutionAuthoritiesPage = () =>
    import('@/components/organisms/pages/manage/institutions/InstitutionAuthoritiesPage.vue');
export const InstitutionMembersPage = () =>
    import('@/components/organisms/pages/manage/institutions/InstitutionMembersPage.vue');
export const InstitutionLocationsPage = () =>
    import('@/components/organisms/pages/manage/institutions/InstitutionLocationsPage.vue');
export const InstitutionProfilesPage = () =>
    import('@/components/organisms/pages/manage/institutions/InstitutionProfilesPage.vue');
export const InstitutionRolesPage = () =>
    import('@/components/organisms/pages/manage/institutions/InstitutionRolesPage.vue');

// Admin pages
export const LocationIndexPage = () =>
    import('@/components/organisms/pages/admin/LocationIndexPage.vue');
export const TagIndexPage = () => import('@/components/organisms/pages/admin/TagIndexPage.vue');
export const AuthorityIndexPage = () =>
    import('@/components/organisms/pages/admin/AuthorityIndexPage.vue');
export const InstitutionIndexPage = () =>
    import('@/components/organisms/pages/admin/InstitutionIndexPage.vue');
export const ProfileIndexPage = () =>
    import('@/components/organisms/pages/admin/ProfileIndexPage.vue');

// Error Pages
export const Error404Page = () => import('@/components/organisms/pages/errors/Error404Page.vue');
export const Error405Page = () => import('@/components/organisms/pages/errors/Error405Page.vue');
