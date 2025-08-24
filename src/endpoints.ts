export const endpoints = {
    auth: {
        login: '/auth/login',
        logout: '/auth/logout',
        register: '/auth/register',
        current: '/profiles/me',
        sso: '/auth/sso/{provider}',
    },
    institutions: {
        list: '/institutions',
    },
    profiles: {
        create: '/profiles',
        update: '/profiles/{id}',
        delete: '/profiles/{id}',
        list: '/profiles',
        avatar: '/profiles/{id}/avatar',
        block: '/profiles/{id}/block',
        unblock: '/profiles/{id}/unblock',
        stats: '/profiles/{id}/stats',
        authorities: {
            list: '/profiles/{id}/authorities',
        },
        reservations: {
            list: '/profiles/{id}/reservations',
        },
        reviews: {
            list: '/profiles/{id}/reviews',
        },
        locations: {
            list: '/profiles/{id}/locations',
        },
    },
    authorities: {
        create: '/authorities',
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
            permissions: {
                update: '/authorities/{id}/members/{profileId}/permissions',
            },
        },
        permissions: '/authorities/permissions',
    },
    locations: {
        create: '/locations',
        read: '/locations/{id}',
        update: '/locations/{id}',
        delete: '/locations/{id}',
        list: '/locations',
        search: '/locations',
        approve: '/locations/{id}/approve',
        reject: '/locations/{id}/reject',
        permissions: '/locations/permissions',
        nearest: '/locations/nearest',
        openingTimes: {
            createMany: '/locations/{id}/opening-times',
            updateOne: '/locations/{id}/opening-times/{openingTimeId}',
            deleteOne: '/locations/{id}/opening-times/{openingTimeId}',
            deleteAll: '/locations/{id}/opening-times',
            listAll: '/locations/{id}/opening-times',
            reservations: {
                createMany: '/locations/{id}/opening-times/{openingTimeId}/reservations',
                deleteOne:
                    '/locations/{id}/opening-times/{openingTimeId}/reservations/{reservationId}',
                listAll: '/locations/{id}/opening-times/{openingTimeId}/reservations',
            },
        },
        members: {
            list: '/locations/{id}/members',
            add: '/locations/{id}/members',
            remove: '/locations/{id}/members/{profileId}',
            permissions: {
                update: '/locations/{id}/members/{profileId}/permissions',
            },
        },
        reservations: {
            list: '/locations/{id}/reservations',
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
        },
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
};

export const mapboxEndpoints = {
    geocoding: {
        forward: '/search/geocode/v6/forward',
        reverse: '/search/geocode/v6/reverse',
    },
};
