import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { parseOpeningTime } from '@/domain/openings';
import { parseProfile } from '@/domain/profile';
import { stringToDate } from '@/utils/date';
import { formatFilters, formatLocationSearchFilters } from '@/utils/filter';
import { createFormDataRequest, formatIncludes, transformPaginatedResponse } from '@/utils/service';
import type {
    Location,
    LocationSearchFilter,
    LocationRequest,
    NearestLocation,
    LocationFilter,
} from './types';
import type { Image, ImageReorderRequest, ImageRequest } from '@/domain/image';
import type { LngLat } from '@/domain/map';
import type { Paginated } from '@/utils/pagination';

export type LocationIncludes = 'images' | 'createdBy';

/**
 * Parse location data from the API by converting string times to Time objects
 *
 * @param locationData - The raw location data from the API
 * @returns The parsed Location object with proper types
 */
export function parseLocation(locationData: any): Location {
    const location = { ...locationData };

    location.createdAt = stringToDate(location.createdAt, true);
    location.updatedAt = stringToDate(location.updatedAt, true);

    if (location.openingTimes) {
        location.openingTimes = location.openingTimes.map(parseOpeningTime);
    }

    if (location.approvedAt) {
        location.approvedAt = stringToDate(location.approvedAt, true);
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
 * @returns {Promise<Paginated<Location>>} A promise that resolves to a paginated list of locations.
 */
export async function searchLocations(
    filters?: Partial<LocationSearchFilter>,
): Promise<Paginated<Location>> {
    const params = formatLocationSearchFilters(filters ?? {});

    const response = await client.get(endpoints.locations.search, {
        params,
        transformResponse: transformPaginatedResponse(parseLocation),
    });

    return response.data;
}

/**
 * List locations with filters and includes.
 *
 * @param {LocationFilter} [filters] - The filters to apply when listing locations.
 * @param {LocationIncludes[]} includes - The related data to include in the response.
 * @returns {Promise<Paginated<Location>>} A promise that resolves to a paginated list of locations.
 */
export async function readLocations(
    filters: Partial<LocationFilter> = {},
    includes: LocationIncludes[] = [],
): Promise<Paginated<Location>> {
    const params = {
        ...formatFilters(filters),
        ...formatIncludes(includes),
    };

    const response = await client.get(endpoints.admin.locations.list, {
        params,
        transformResponse: transformPaginatedResponse(parseLocation),
    });

    return response.data;
}

/**
 * Get images for a location by its ID.
 *
 * @param {number} locationId - The ID of the location to fetch images for.
 * @returns {Promise<string[]>} A promise that resolves to an array of image URLs.
 */
export async function readLocationImages(locationId: number): Promise<Image[]> {
    const response = await client.get(
        endpoints.locations.images.read.replace('{id}', locationId.toString()),
    );

    return response.data;
}

/**
 * Get a location by its ID.
 *
 * @param {string} id - The ID of the location to fetch.
 * @param {LocationIncludes[]} includes - The related data to include in the response.
 * @returns {Promise<Location>} A promise that resolves to the location data.
 */
export async function readLocation(
    id: number,
    includes: LocationIncludes[] = [],
): Promise<Location> {
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
export async function readNearestLocation(center: LngLat): Promise<NearestLocation> {
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
    const endpoint = endpoints.locations.images.createOne.replace('{id}', locationId.toString());

    const request = createFormDataRequest({
        image: image.file,
        index: image.index,
    });

    const { data } = await client.post(endpoint, request);

    return parseLocation(data);
}

/**
 * Update a location.
 *
 * @param {number} id - The ID of the location to update.
 * @param {LocationRequest} locationData - The updated location data.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function updateLocation(id: number, locationData: LocationRequest): Promise<Location> {
    const { data } = await client.patch(
        endpoints.locations.update.replace('{id}', id.toString()),
        locationData,
    );

    return parseLocation(data);
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
    const { data } = await client.post(endpoints.locations.approve.replace('{id}', id.toString()));

    return parseLocation(data);
}

/**
 * Reject a location to remove it from the public listing.
 *
 * @param {number} id - The ID of the location to reject.
 * @param {string | null} reason - The reason for rejecting the location.
 * @returns {Promise<Location>} A promise that resolves to the rejected location.
 */
export async function rejectLocation(id: number, reason?: string | null): Promise<Location> {
    const { data } = await client.post(endpoints.locations.reject.replace('{id}', id.toString()), {
        reason,
    });

    return parseLocation(data);
}

/**
 * Pend a location to set its status to pending review.
 *
 * @param {number} id - The ID of the location to pend.
 * @returns {Promise<Location>} A promise that resolves to the pended location.
 */
export async function pendLocation(id: number): Promise<Location> {
    const { data } = await client.post(endpoints.locations.pend.replace('{id}', id.toString()));
    return parseLocation(data);
}

/**
 * Delete a specific image from a location.
 *
 * @param {number} locationId - The ID of the location to delete the image from.
 * @param {number} imageId - The ID of the image to delete.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function deleteLocationImage(locationId: number, imageId: number): Promise<void> {
    const endpoint = endpoints.locations.images.deleteOne
        .replace('{id}', locationId.toString())
        .replace('{imageId}', imageId.toString());

    client.delete(endpoint);
}

/**
 * Reorder images for a location.
 *
 * @param {number} locationId - The ID of the location to reorder images for.
 * @param {ImageReorderRequest[]} images - The new order of images.
 * @returns {Promise<void>} A promise that resolves when the reordering is complete.
 */
export async function reorderLocationImages(
    locationId: number,
    images: ImageReorderRequest[],
): Promise<void> {
    await client.post(
        endpoints.locations.images.reorder.replace('{id}', locationId.toString()),
        images,
    );
}
