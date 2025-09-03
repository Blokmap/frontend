// Profile
export const ProfilePage = () => import('@/pages/public/profile/ProfilePage.vue');
export const ReservationsPage = () => import('@/pages/public/profile/ReservationsPage.vue');

// Locations
export const LocationsPage = () => import('@/pages/public/locations/LocationsPage.vue');
export const LocationPage = () => import('@/pages/public/locations/LocationPage.vue');
export const LocationSubmitPage = () => import('@/pages/public/locations/LocationSubmitPage.vue');

// Authentication
export const AuthPage = () => import('@/pages/auth/AuthPage.vue');

// Dashboard
export const DashboardPage = () => import('@/pages/dashboard/DashboardPage.vue');

// Dashboard Locations
export const DashboardLocationsPage = () => import('@/pages/dashboard/locations/LocationsPage.vue');
export const DashboardLocationPage = () => import('@/pages/dashboard/locations/LocationPage.vue');

// Dashboard Authorities
export const DashboardAuthoritiesPage = () =>
    import('@/pages/dashboard/authorities/AuthoritiesPage.vue');
export const DashboardAuthorityPage = () =>
    import('@/pages/dashboard/authorities/AuthorityPage.vue');

// Dashboard Institutions
export const DashboardInstitutionsPage = () =>
    import('@/pages/dashboard/institutions/InstitutionsPage.vue');
export const DashboardInstitutionPage = () =>
    import('@/pages/dashboard/institutions/InstitutionPage.vue');
