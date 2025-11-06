/**
 * Centralized query key factory with hierarchical structure.
 * Simple, clean keys with minimal type annotations.
 *
 * Structure:
 * - Entity base: ['entity'] - invalidate all queries for an entity
 * - Entity lists: ['entity', 'list'] - invalidate all list queries
 * - Entity list: ['entity', 'list', ...filters] - specific list query
 * - Entity singles: ['entity', 'detail'] - invalidate all single item queries
 * - Entity detail: ['entity', 'detail', id] - specific single item query
 */
export const queryKeys = {
    // Locations
    locations: {
        all: () => ['locations'],
        lists: () => ['locations', 'list'],
        list: (filters: any) => ['locations', 'list', filters],
        search: (filters: any) => ['locations', 'list', 'search', filters],
        byProfile: (profileId: any) => ['locations', 'list', 'profile', profileId],
        byAuthority: (authorityId: any) => ['locations', 'list', 'authority', authorityId],
        singles: () => ['locations', 'detail'],
        detail: (id: any) => ['locations', 'detail', id],
    },

    // Reservations
    reservations: {
        all: () => ['reservations'],
        lists: () => ['reservations', 'list'],
        byLocation: (locationId: any, filters: any) => [
            'reservations',
            'list',
            'location',
            locationId,
            filters,
        ],
        byProfile: (profileId: any, filters: any) => [
            'reservations',
            'list',
            'profile',
            profileId,
            filters,
        ],
        singles: () => ['reservations', 'detail'],
        detail: (id: any) => ['reservations', 'detail', id],
    },

    // Opening times
    openingTimes: {
        all: (locationId: any) => ['opening-times', locationId],
        lists: (locationId: any) => ['opening-times', locationId, 'list'],
        filtered: (locationId: any, filters: any) => ['opening-times', locationId, 'list', filters],
        singles: (locationId: any) => ['opening-times', locationId, 'detail'],
    },

    // Profiles
    profiles: {
        all: () => ['profiles'],
        lists: () => ['profiles', 'list'],
        stats: (profileId: any) => ['profiles', 'stats', profileId],
        list: (filters: any) => ['profiles', 'list', filters],
        singles: () => ['profiles', 'detail'],
        detail: (profileId: any) => ['profiles', 'detail', profileId],
        byInstitution: (institutionId: any, pagination: any) => [
            'profiles',
            'list',
            'institution',
            institutionId,
            pagination,
        ],
    },

    // Authorities
    authorities: {
        all: () => ['authorities'],
        lists: () => ['authorities', 'list'],
        list: (filters: any) => ['authorities', 'list', filters],
        singles: () => ['authorities', 'detail'],
        detail: (id: any) => ['authorities', 'detail', id],
        byProfile: (profileId: any) => ['authorities', 'list', 'profile', profileId],
    },

    // Institutions
    institutions: {
        all: () => ['institutions'],
        lists: () => ['institutions', 'list'],
        list: (filters: any) => ['institutions', 'list', filters],
        singles: () => ['institutions', 'detail'],
        detail: (id: any) => ['institutions', 'detail', id],
        authorities: (id: any) => ['institutions', 'list', 'authorities', id],
    },

    // Members
    members: {
        all: () => ['members'],
        lists: () => ['members', 'list'],
        byLocation: (locationId: any) => ['members', 'list', 'location', locationId],
        byAuthority: (authorityId: any) => ['members', 'list', 'authority', authorityId],
        byInstitution: (institutionId: any) => ['members', 'list', 'institution', institutionId],

        memberships: {
            all: () => ['members', 'memberships'],

            byProfileLocations: (profileId: any) => [
                'members',
                'memberships',
                'locations',
                profileId,
            ],
            byProfileAuthorities: (profileId: any) => [
                'members',
                'memberships',
                'authorities',
                profileId,
            ],
            byProfileInstitutions: (profileId: any) => [
                'members',
                'memberships',
                'institutions',
                profileId,
            ],
        },
    },

    // Admin
    admin: {
        all: () => ['admin'],
        counts: () => ['admin', 'counts'],
        stats: () => ['admin', 'stats'],
    },

    // Geocoding
    geo: {
        all: () => ['geo'],
        lists: () => ['geo', 'list'],
        search: (filters: any) => ['geo', 'list', 'search', filters],
    },
};
