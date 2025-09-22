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
export const LocationDetailPage = () =>
    import('@/pages/dashboard/locations/LocationDetailPage.vue');
export const LocationsIndexPage = () =>
    import('@/pages/dashboard/locations/LocationsIndexPage.vue');

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

// Dashboard Statistics
export const DashboardStatisticsPage = () =>
    import('@/pages/dashboard/statistics/StatisticsPage.vue');

// Dashboard Users
export const DashboardUsersPage = () => import('@/pages/dashboard/users/UsersPage.vue');

// Dashboard Reviews
export const DashboardReviewsPage = () => import('@/pages/dashboard/reviews/ReviewsPage.vue');
