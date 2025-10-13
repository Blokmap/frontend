import { formatDate } from '@vueuse/core';
import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { parseProfile } from '@/domain/profile';
import { dateToString, stringToDate } from '@/utils/date';
import { formatIncludes, transformPaginatedResponse } from '@/utils/service';
import { stringToTime, timeToString } from '@/utils/time';
import type {
    Location,
    LocationSearchFilter,
    LocationRequest,
    NearestLocation,
    LocationFilter,
} from './types';
import type { ImageRequest } from '@/domain/image';
import type { LngLat } from '@/domain/map';
import type { OpeningTime, OpeningTimeRequest } from '@/domain/openings';
import type { Paginated } from '@/types';

export type LocationIncludes = 'images' | 'createdBy';

/**
 * Parse an opening time object from the API by converting string times to Time objects
 *
 * @param openingTimeData - The raw opening time data from the API
 * @returns The parsed OpeningTime object with proper types
 */
export function parseOpeningTime(openingTimeData: any): OpeningTime {
    return {
        ...openingTimeData,
        startTime: stringToTime(openingTimeData.startTime),
        endTime: stringToTime(openingTimeData.endTime),
        day: stringToDate(openingTimeData.day),
        reservableFrom: stringToDate(openingTimeData.reservableFrom),
        reservableUntil: stringToDate(openingTimeData.reservableUntil),
        createdAt: stringToDate(openingTimeData.createdAt),
        updatedAt: stringToDate(openingTimeData.updatedAt),
    };
}

/**
 * Parse location data from the API by converting string times to Time objects
 *
 * @param locationData - The raw location data from the API
 * @returns The parsed Location object with proper types
 */
export function parseLocation(locationData: any): Location {
    const location = { ...locationData };

    location.createdAt = stringToDate(location.createdAt);
    location.updatedAt = stringToDate(location.updatedAt);

    if (location.openingTimes) {
        location.openingTimes = location.openingTimes.map(parseOpeningTime);
    }

    if (location.approvedAt) {
        location.approvedAt = stringToDate(location.approvedAt);
    }

    if (location.createdBy) {
        location.createdBy = parseProfile(location.createdBy);
    }

    return location;
}

/**
 * Search for locations based on filters.
 *
 * @param {LocationSearchFilter} [filters] - The filters to apply when searching for locations.
 * @param {string} [locale] - The locale to use for the search.
 * @returns {Promise<Paginated<Location>>} A promise that resolves to a paginated list of locations.
 */
export async function searchLocations(
    filters?: Partial<LocationSearchFilter>,
    language?: string,
): Promise<Paginated<Location>> {
    const [southWest, northEast] = filters?.bounds ?? [];
    const northEastLng = northEast?.[0];
    const northEastLat = northEast?.[1];
    const southWestLng = southWest?.[0];
    const southWestLat = southWest?.[1];

    const centerLng = filters?.center?.coords?.[0];
    const centerLat = filters?.center?.coords?.[1];
    const distance = filters?.center?.radius;

    const query = filters?.query || null;
    const page = filters?.page;
    const perPage = filters?.perPage;
    const openOnDay = dateToString(filters?.openOn);

    const params = {
        northEastLng,
        northEastLat,
        southWestLng,
        southWestLat,
        centerLng,
        centerLat,
        distance,
        query,
        page,
        perPage,
        openOnDay,
        language,
    };

    const response = await client.get(endpoints.locations.search, {
        params,
        transformResponse: transformPaginatedResponse(parseLocation),
    });

    return response.data;
}

export async function listLocations(
    filters: Partial<LocationFilter> = {},
    language: string,
    includes: LocationIncludes[],
): Promise<Paginated<Location>> {
    const query = filters.query || null;
    const load = formatIncludes(includes);

    const params = {
        ...filters,
        ...load,
        query,
        language,
    };

    const response = await client.get(endpoints.admin.locations.list, {
        params,
        transformResponse: transformPaginatedResponse(parseLocation),
    });

    return response.data;
}
/**
 * Get a location by its ID.
 *
 * @param {string} id - The ID of the location to fetch.
 * @param {LocationIncludes[]} includes - The related data to include in the response.
 * @returns {Promise<Location>} A promise that resolves to the location data.
 */
export async function getLocationById(id: number, includes: LocationIncludes[]): Promise<Location> {
    const params = formatIncludes(includes);

    const response = await client.get(endpoints.locations.read.replace('{id}', id.toString()), {
        params,
    });

    return parseLocation(response.data);
}

/** Get the nearest location based on a center point.
 *
 * @param {LngLat} center - The center point to find the nearest location to.
 * @returns {Promise<NearestLocation>} A promise that resolves to the nearest location data.
 */
export async function getNearestLocation(center: LngLat): Promise<NearestLocation> {
    const response = await client.get(endpoints.locations.nearest, {
        params: {
            centerLng: center[0],
            centerLat: center[1],
        },
    });

    return response.data;
}

/**
 * Create a new location.
 *
 * @param {LocationRequest} locationData - The location data to create.
 * @returns {Promise<Location>} A promise that resolves to the created location.
 */
export async function createLocation(locationData: LocationRequest): Promise<Location> {
    const response = await client.post(endpoints.locations.create, locationData);
    return parseLocation(response.data);
}

/**
 * Set images for a location.
 *
 * @param {number} locationId - The ID of the location to set images for.
 * @param {ImageRequest} image - The images to set for the location.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function createLocationImage(
    locationId: number,
    image: ImageRequest,
): Promise<Location> {
    const formData = new FormData();

    if (image.file) {
        formData.append('image', image.file);
        formData.append('index', image.index.toString());
    }

    const response = await client.post(
        endpoints.locations.images.createOne.replace('{id}', locationId.toString()),
        formData,
    );

    return parseLocation(response.data);
}

/**
 * Update a location.
 *
 * @param {number} id - The ID of the location to update.
 * @param {LocationRequest} locationData - The updated location data.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function updateLocation(id: number, locationData: LocationRequest): Promise<Location> {
    const response = await client.patch(
        endpoints.locations.update.replace('{id}', id.toString()),
        locationData,
    );
    return parseLocation(response.data);
}

/**
 * Delete a location by its ID.
 *
 * @param {number} id - The ID of the location to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteLocation(id: number): Promise<void> {
    await client.delete(endpoints.locations.delete.replace('{id}', id.toString()));
}

/**
 * Create time slots for a location.
 *
 * @param {number} locationId - The ID of the location to create time slots for.
 * @param {OpeningTimeRequest[]} openings - The opening times to create as time slots.
 * @returns {Promise<Location>} A promise that resolves to the updated location with new time slots.
 */
export async function createLocationOpenings(
    locationId: number,
    openings: OpeningTimeRequest[],
): Promise<Location> {
    const formatted = openings.map((opening) => {
        const day = formatDate(opening.day, 'YYYY-MM-DD');
        return {
            ...opening,
            day,
            startTime: timeToString(opening.startTime),
            endTime: timeToString(opening.endTime),
        };
    });

    const response = await client.post(
        endpoints.locations.openingTimes.createMany.replace('{id}', locationId.toString()),
        formatted,
    );

    return parseLocation(response.data);
}

/**
 * Delete all opening times for a location.
 *
 * @param {number} locationId - The ID of the location to delete opening times for.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteLocationOpenings(locationId: number): Promise<void> {
    await client.delete(
        endpoints.locations.openingTimes.deleteAll.replace('{id}', locationId.toString()),
    );
}

/**
 * Delete all images for a location.
 *
 * @param {number} locationId - The ID of the location to delete images for.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteLocationImages(locationId: number): Promise<void> {
    await client.delete(
        endpoints.locations.images.deleteAll.replace('{id}', locationId.toString()),
    );
}

/**
 * Approve a location to make it appear in the public listing.
 *
 * @param {number} id - The ID of the location to approve.
 * @returns {Promise<Location>} A promise that resolves to the approved location.
 */
export async function approveLocation(id: number): Promise<Location> {
    const response = await client.post(endpoints.locations.approve.replace('{id}', id.toString()));
    return parseLocation(response.data);
}

/**
 * Reject a location to remove it from the public listing.
 *
 * @param {number} id - The ID of the location to reject.
 * @param {string | null} reason - The reason for rejecting the location.
 * @returns {Promise<Location>} A promise that resolves to the rejected location.
 */
export async function rejectLocation(id: number, reason?: string | null): Promise<Location> {
    const response = await client.post(endpoints.locations.reject.replace('{id}', id.toString()), {
        reason,
    });
    return parseLocation(response.data);
}

/**
 * Pend a location to set its status to pending review.
 *
 * @param {number} id - The ID of the location to pend.
 * @returns {Promise<Location>} A promise that resolves to the pended location.
 */
export async function pendLocation(id: number): Promise<Location> {
    const response = await client.post(endpoints.locations.pend.replace('{id}', id.toString()));
    return parseLocation(response.data);
}
