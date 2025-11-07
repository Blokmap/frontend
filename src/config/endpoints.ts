export const endpoints = {
    auth: {
        // endpoints in auth service
        login: '/auth/local/login',
        register: '/auth/local/register',
        sso: '/auth/sso/{provider}',
        // endpoints in backend
        current: '/profiles/me',
        logout: '/logout',
    },
    institutions: {
        create: '/institutions',
        read: '/institutions/{id}',
        update: '/institutions/{id}',
        list: '/institutions',
        roles: {
            list: '/institutions/{id}/roles',
            create: '/institutions/{id}/roles',
            update: '/institutions/{id}/roles/{roleId}',
            delete: '/institutions/{id}/roles/{roleId}',
        },
        members: {
            list: '/institutions/{id}/members',
            add: '/institutions/{id}/members',
            remove: '/institutions/{id}/members/{profileId}',
            update: '/institutions/{id}/members/{profileId}',
        },
        profiles: {
            list: '/institutions/{id}/profiles',
        },
        authorities: {
            list: '/institutions/{id}/authorities',
            add: '/institutions/{id}/authorities',
            remove: '/institutions/{id}/authorities/{authorityId}',
        },
    },
    profiles: {
        list: '/profiles',
        create: '/profiles',
        read: '/profiles/{id}',
        update: '/profiles/{id}',
        delete: '/profiles/{id}',
        avatar: '/profiles/{id}/avatar',
        block: '/profiles/{id}/block',
        unblock: '/profiles/{id}/unblock',
        stats: '/profiles/{id}/stats',
        scan: '/profiles/{id}/scan',
        reservations: {
            list: '/profiles/{id}/reservations',
        },
        reviews: {
            list: '/profiles/{id}/reviews',
        },
        locations: {
            list: '/profiles/{id}/locations',
            memberships: '/profiles/{id}/locations/memberships',
        },
        authorities: {
            list: '/profiles/{id}/authorities',
            memberships: '/profiles/{id}/authorities/memberships',
        },
        institutions: {
            memberships: '/profiles/{id}/institutions/memberships',
        },
    },
    authorities: {
        create: '/authorities',
        read: '/authorities/{id}',
        update: '/authorities/{id}',
        list: '/authorities',
        locations: {
            list: '/authorities/{id}/locations',
            create: '/authorities/{id}/locations',
        },
        members: {
            list: '/authorities/{id}/members',
            add: '/authorities/{id}/members',
            remove: '/authorities/{id}/members/{profileId}',
            update: '/authorities/{id}/members/{profileId}',
        },
        roles: {
            list: '/authorities/{id}/roles',
            create: '/authorities/{id}/roles',
            update: '/authorities/{id}/roles/{roleId}',
            delete: '/authorities/{id}/roles/{roleId}',
        },
    },
    locations: {
        create: '/locations',
        read: '/locations/{id}',
        update: '/locations/{id}',
        delete: '/locations/{id}',
        list: '/locations',
        search: '/locations/search',
        state: '/locations/{id}/state',
        permissions: '/locations/permissions',
        nearest: '/locations/nearest',
        scan: '/locations/{id}/scan',
        openingTimes: {
            createMany: '/locations/{id}/opening-times',
            updateOne: '/locations/{id}/opening-times/{openingTimeId}',
            deleteOne: '/locations/{id}/opening-times/{openingTimeId}',
            deleteAll: '/locations/{id}/opening-times',
            listAll: '/locations/{id}/opening-times',
            reservations: {
                create: '/locations/{id}/opening-times/{openingTimeId}/reservations',
                delete: '/locations/{id}/opening-times/{openingTimeId}/reservations/{reservationId}',
                read: '/locations/{id}/opening-times/{openingTimeId}/reservations',
            },
        },
        members: {
            create: '/locations/{id}/members',
            read: '/locations/{id}/members/{profileId}',
            update: '/locations/{id}/members/{profileId}',
            list: '/locations/{id}/members',
            add: '/locations/{id}/members',
            delete: '/locations/{id}/members/{profileId}',
        },
        roles: {
            list: '/locations/{id}/roles',
            create: '/locations/{id}/roles',
            update: '/locations/{id}/roles/{roleId}',
            delete: '/locations/{id}/roles/{roleId}',
        },
        reservations: {
            list: '/locations/{id}/reservations',
            confirm: '/locations/{id}/reservations/{reservationId}/confirm',
            create: '/locations/{id}/reservations',
            delete: '/locations/{id}/reservations',
        },
        reviews: {
            list: '/locations/{id}/reviews',
            create: '/locations/{id}/reviews',
            update: '/locations/{id}/reviews/{reviewId}',
            delete: 'locations/{id}/reviews/{reviewId}',
        },
        tags: {
            list: '/locations/{id}/tags',
            update: '/locations/{id}/tags',
        },
        images: {
            createOne: '/locations/{id}/images',
            deleteOne: '/locations/{id}/images/{imageId}',
            deleteAll: '/locations/{id}/images',
            reorder: '/locations/{id}/images/reorder',
            read: '/locations/{id}/images',
        },
    },
    reservations: {
        delete: '/reservations/{id}',
        update: '/reservations/{id}',
    },
    tags: {
        list: '/tags',
        create: '/tags',
        update: '/tags/{id}',
        delete: '/tags/{id}',
    },
    translations: {
        create: '/translations',
        update: '/translations/{id}',
        delete: '/translations/{id}',
    },
    admin: {
        stats: '/admin/stats',
        counts: '/admin/counts',
    },
};

export const mapboxEndpoints = {
    geocoding: {
        forward: '/search/geocode/v6/forward',
        reverse: '/search/geocode/v6/reverse',
    },
};

export const websocketEndpoint = '/api/ws';
