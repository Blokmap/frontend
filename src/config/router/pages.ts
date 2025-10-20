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
export const LocationDetailLayout = () => import('@/layouts/dashboard/LocationDetailLayout.vue');
export const LocationInfoPage = () => import('@/pages/dashboard/locations/LocationInfoPage.vue');
export const LocationReservationsPage = () =>
    import('@/pages/dashboard/locations/LocationReservationsPage.vue');
export const LocationScanPage = () => import('@/pages/dashboard/locations/LocationScanPage.vue');
export const LocationOpeningsPage = () =>
    import('@/pages/dashboard/locations/LocationOpeningsPage.vue');
export const LocationImagesPage = () =>
    import('@/pages/dashboard/locations/LocationImagesPage.vue');
export const LocationSettingsPage = () =>
    import('@/pages/dashboard/locations/LocationSettingsPage.vue');
export const LocationsIndexPage = () =>
    import('@/pages/dashboard/locations/LocationsIndexPage.vue');

// Dashboard Profiles
export const ProfilesIndexPage = () => import('@/pages/dashboard/profiles/ProfilesIndexPage.vue');
export const ProfileLocationsPage = () =>
    import('@/pages/dashboard/profiles/ProfileLocationsPage.vue');

// Dashboard Authorities
export const DashboardAuthoritiesPage = () =>
    import('@/pages/dashboard/authorities/AuthoritiesPage.vue');
export const DashboardAuthorityPage = () =>
    import('@/pages/dashboard/authorities/AuthorityPage.vue');

// Dashboard Institutions
export const DashboardInstitutionsPage = () =>
    import('@/pages/dashboard/institutions/InstitutionsPage.vue');
export const InstitutionIndexPage = () =>
    import('@/pages/dashboard/institutions/InstitutionIndexPage.vue');
export const DashboardInstitutionPage = () =>
    import('@/pages/dashboard/institutions/InstitutionPage.vue');

// Dashboard Statistics
export const DashboardStatisticsPage = () =>
    import('@/pages/dashboard/statistics/StatisticsPage.vue');

// Dashboard Reviews
export const DashboardReviewsPage = () => import('@/pages/dashboard/reviews/ReviewsPage.vue');
