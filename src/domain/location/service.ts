import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { stringToDate } from '@/utils/date';
import { formatFilters, formatLocationSearchFilters } from '@/utils/filter';
import {
    formatFormDataRequest,
    transformPaginatedResponseFactory,
    transformResponseFactory,
} from '@/utils/service';
import { parseProfileResponse } from '../auth';
import { parseImageResponse } from '../image';
import { parseOpeningTimeResponse } from '../openings';
import { parseTranslationResponse } from '../translation';
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
 * Transform a Location response object.
 *
 * @param data - The raw location data from the API.
 * @returns The parsed Location object.
 */
export function parseLocationResponse(data: any): Location {
    const result: Location = {
        ...data,
        excerpt: parseTranslationResponse(data.excerpt),
        description: parseTranslationResponse(data.description),
        approvedAt: stringToDate(data.approvedAt),
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
        rejectedAt: stringToDate(data.rejectedAt),
    };

    if (data.openingTimes) {
        result.openingTimes = data.openingTimes.map(parseOpeningTimeResponse);
    }

    if (data.images) {
        result.images = data.images.map(parseImageResponse);
    }

    if (data.createdBy) {
        result.createdBy = parseProfileResponse(data.createdBy);
    }

    if (data.updatedBy) {
        result.updatedBy = parseProfileResponse(data.updatedBy);
    }

    if (data.approvedBy) {
        result.approvedBy = parseProfileResponse(data.approvedBy);
    }

    if (data.rejectedBy) {
        result.rejectedBy = parseProfileResponse(data.rejectedBy);
    }

    return result;
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
    const endpoint = endpoints.locations.search;

    const params = formatLocationSearchFilters(filters ?? {});

    const transformResponse = transformPaginatedResponseFactory(parseLocationResponse);

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
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
    locationIncludes: LocationIncludes[] = [],
): Promise<Paginated<Location>> {
    const endpoint = endpoints.admin.locations.list;

    const params = {
        locationIncludes,
        ...formatFilters(filters),
    };

    const transformResponse = transformPaginatedResponseFactory(parseLocationResponse);

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
}

/**
 * Get images for a location by its ID.
 *
 * @param {number} locationId - The ID of the location to fetch images for.
 * @returns {Promise<string[]>} A promise that resolves to an array of image URLs.
 */
export async function readLocationImages(locationId: number): Promise<Image[]> {
    const endpoint = endpoints.locations.images.read.replace('{id}', locationId.toString());

    const { data } = await client.get(endpoint);

    return data;
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
    const endpoint = endpoints.locations.read.replace('{id}', id.toString());

    const params = { includes };

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
}

/** Get the nearest location based on a center point.
 *
 * @param {LngLat} center - The center point to find the nearest location to.
 * @returns {Promise<NearestLocation>} A promise that resolves to the nearest location data.
 */
export async function readNearestLocation(center: LngLat): Promise<NearestLocation> {
    const endpoint = endpoints.locations.nearest;

    const { data } = await client.get(endpoint, {
        params: {
            centerLng: center[0],
            centerLat: center[1],
        },
    });

    return data;
}

/**
 * Create a new location.
 *
 * @param {LocationRequest} body - The location data to create.
 * @returns {Promise<Location>} A promise that resolves to the created location.
 */
export async function createLocation(body: LocationRequest): Promise<Location> {
    const endpoint = endpoints.locations.create;

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
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
    request: ImageRequest,
): Promise<Location> {
    const endpoint = endpoints.locations.images.createOne.replace('{id}', locationId.toString());

    const body = formatFormDataRequest({
        image: request.file,
        index: request.index,
    });

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Update a location.
 *
 * @param {number} id - The ID of the location to update.
 * @param {LocationRequest} body - The updated location data.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function updateLocation(id: number, body: LocationRequest): Promise<Location> {
    const endpoint = endpoints.locations.update.replace('{id}', id.toString());

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.patch(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Delete a location by its ID.
 *
 * @param {number} id - The ID of the location to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteLocation(id: number): Promise<void> {
    const endpoint = endpoints.locations.delete.replace('{id}', id.toString());

    await client.delete(endpoint);
}

/**
 * Delete all opening times for a location.
 *
 * @param {number} locationId - The ID of the location to delete opening times for.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteLocationOpenings(locationId: number): Promise<void> {
    const endpoint = endpoints.locations.openingTimes.deleteAll.replace(
        '{id}',
        locationId.toString(),
    );

    await client.delete(endpoint);
}

/**
 * Delete all images for a location.
 *
 * @param {number} locationId - The ID of the location to delete images for.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteLocationImages(locationId: number): Promise<void> {
    const endpoint = endpoints.locations.images.deleteAll.replace('{id}', locationId.toString());

    await client.delete(endpoint);
}

/**
 * Approve a location to make it appear in the public listing.
 *
 * @param {number} id - The ID of the location to approve.
 * @returns {Promise<Location>} A promise that resolves to the approved location.
 */
export async function approveLocation(id: number): Promise<Location> {
    const endpoint = endpoints.locations.approve.replace('{id}', id.toString());

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.post(endpoint, null, {
        transformResponse,
    });

    return data;
}

/**
 * Reject a location to remove it from the public listing.
 *
 * @param {number} id - The ID of the location to reject.
 * @param {string | null} reason - The reason for rejecting the location.
 * @returns {Promise<Location>} A promise that resolves to the rejected location.
 */
export async function rejectLocation(id: number, reason?: string | null): Promise<Location> {
    const endpoint = endpoints.locations.reject.replace('{id}', id.toString());

    const body = { reason };

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}

/**
 * Pend a location to set its status to pending review.
 *
 * @param {number} id - The ID of the location to pend.
 * @returns {Promise<Location>} A promise that resolves to the pended location.
 */
export async function pendLocation(id: number): Promise<Location> {
    const endpoint = endpoints.locations.pend.replace('{id}', id.toString());

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.post(endpoint, null, {
        transformResponse,
    });

    return data;
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
    const endpoint = endpoints.locations.images.reorder.replace('{id}', locationId.toString());

    await client.post(endpoint, images);
}

/**
 * Fetches the locations associated with a specific profile.
 *
 * @param profileId - The ID of the profile whose locations are to be fetched.
 * @returns A promise that resolves to a paginated list of locations.
 */
export async function readProfileLocations(profileId: string): Promise<Location[]> {
    const endpoint = endpoints.profiles.locations.list.replace('{id}', profileId.toString());

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.get<Location[]>(endpoint, {
        transformResponse,
    });

    return data;
}
