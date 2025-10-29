import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import {
    type Reservation,
    type ReservationFilter,
    type ReservationIncludes,
} from '@/domain/reservation';
import { formatFilters, formatLocationSearchFilters } from '@/utils/filter';
import {
    createFormDataRequest,
    formatIncludes,
    transformPaginatedResponse,
    transformResponse,
} from '@/utils/service';
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

    const { data } = await client.get(endpoint, {
        params,
        transformResponse: transformPaginatedResponse,
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
    includes: LocationIncludes[] = [],
): Promise<Paginated<Location>> {
    const endpoint = endpoints.admin.locations.list;

    const params = {
        ...formatFilters(filters),
        ...formatIncludes(includes),
    };

    const { data } = await client.get(endpoint, {
        params,
        transformResponse: transformPaginatedResponse,
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

    const params = formatIncludes(includes);

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
 * @param {LocationRequest} locationData - The location data to create.
 * @returns {Promise<Location>} A promise that resolves to the created location.
 */
export async function createLocation(locationData: LocationRequest): Promise<Location> {
    const endpoint = endpoints.locations.create;

    const { data } = await client.post(endpoint, locationData, {
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
    image: ImageRequest,
): Promise<Location> {
    const endpoint = endpoints.locations.images.createOne.replace('{id}', locationId.toString());

    const request = createFormDataRequest({
        image: image.file,
        index: image.index,
    });

    const { data } = await client.post(endpoint, request, {
        transformResponse,
    });

    return data;
}

/**
 * Update a location.
 *
 * @param {number} id - The ID of the location to update.
 * @param {LocationRequest} locationData - The updated location data.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function updateLocation(id: number, locationData: LocationRequest): Promise<Location> {
    const endpoint = endpoints.locations.update.replace('{id}', id.toString());

    const { data } = await client.patch(endpoint, locationData, {
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

    const { data } = await client.post(endpoint, {
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

    const { data } = await client.post(endpoint, {
        reason,
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

    const { data } = await client.post(endpoint, {
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
 * Get reservations for a specific location.
 *
 * @param locationId - The ID of the location to fetch reservations for.
 * @param filters - The filters to apply when fetching reservations.
 * @param includes - The related data to include in the response.
 * @returns A promise that resolves to an array of reservations.
 */
export async function readLocationReservations(
    locationId: number,
    filters: Partial<ReservationFilter> = {},
    includes: ReservationIncludes[] = [],
): Promise<Reservation[]> {
    const endpoint = endpoints.locations.reservations.list.replace('{id}', locationId.toString());

    const params = {
        ...formatFilters(filters, ['inWeekOf', 'day']),
        ...formatIncludes(includes),
    };

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
}
