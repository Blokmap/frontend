import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { formatFilters, formatLocationSearchFilters } from '@/utils/filter';
import {
    formatFormDataBody,
    transformPaginatedResponseFactory,
    transformResponseFactory,
} from '@/utils/serviceUtils';
import { parseLocationResponse } from '../locationParser';
import {
    type Location,
    type LocationSearchFilter,
    type LocationBody,
    type NearestLocation,
    type LocationFilter,
    type LocationStateBody,
    type RecentLocationFilter,
} from '../types';
import type { Image, ImageReorderBody, ImageBody } from '@/domain/image';
import type { LngLat } from '@/domain/map';
import type { Paginated } from '@/utils/pagination';

export type LocationIncludes =
    | 'authority'
    | 'createdBy'
    | 'approvedBy'
    | 'rejectedBy'
    | 'updatedBy';

/**
 * Search for locations based on filters.
 *
 * @param {LocationSearchFilter} [filters] - The filters to apply when searching for locations.
 * @returns {Promise<Paginated<Location>>} A promise that resolves to a paginated list of locations.
 */
export async function searchLocations(
    filters: Partial<LocationSearchFilter>,
): Promise<Paginated<Location>> {
    const endpoint = endpoints.locations.search;

    const params = formatLocationSearchFilters(filters);

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
    const endpoint = endpoints.locations.list;

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
 * @param {LocationBody} body - The location data to create.
 * @returns {Promise<Location>} A promise that resolves to the created location.
 */
export async function createLocation(body: LocationBody): Promise<Location> {
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
 * @param {ImageBody} request - The images to set for the location.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function createLocationImage(
    locationId: number,
    request: ImageBody,
): Promise<Location> {
    const endpoint = endpoints.locations.images.createOne.replace('{id}', locationId.toString());

    const body = formatFormDataBody({
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
 * @param {LocationBody} body - The updated location data.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function updateLocation(id: number, body: Partial<LocationBody>): Promise<Location> {
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
 * Update the state of a location.
 *
 * @param {number} id - The ID of the location.
 * @param {LocationStateBody} body - The state and optional reason.
 * @returns {Promise<void>} A promise that resolves when the state is updated.
 */
export async function updateLocationState(id: number, body: LocationStateBody): Promise<void> {
    const endpoint = endpoints.locations.state.replace('{id}', id.toString());
    await client.patch(endpoint, body);
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
 * @param {ImageReorderBody[]} images - The new order of images.
 * @returns {Promise<void>} A promise that resolves when the reordering is complete.
 */
export async function reorderLocationImages(
    locationId: number,
    images: ImageReorderBody[],
): Promise<void> {
    const endpoint = endpoints.locations.images.reorder.replace('{id}', locationId.toString());

    await client.post(endpoint, images);
}

/**
 * Fetches all locations a profile has access to.
 *
 * @param profileId - The ID of the profile whose locations are to be fetched.
 * @returns A promise that resolves to a paginated list of locations.
 */
export async function readProfileLocations(
    profileId: string,
    includes: LocationIncludes[] = [],
): Promise<Paginated<Location>> {
    const endpoint = endpoints.profiles.locations.list.replace('{id}', profileId.toString());

    const transformResponse = transformPaginatedResponseFactory(parseLocationResponse);

    const { data } = await client.get(endpoint, {
        params: { locationIncludes: includes },
        transformResponse,
    });

    return data;
}

/**
 * Fetches the locations associated with a specific authority.
 *
 * @param authorityId - The ID of the authority whose locations are to be fetched.
 * @returns A promise that resolves to a paginated list of locations.
 */
export async function readAuthorityLocations(authorityId: number): Promise<Location[]> {
    const endpoint = endpoints.authorities.locations.list.replace('{id}', authorityId.toString());

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.get<Location[]>(endpoint, {
        transformResponse,
    });

    return data;
}

/**
 * Fetches the recent locations associated with a specific profile.
 * A recent location is defined as a location that the profile has most recently made reservations for.
 *
 * @param profileId - The ID of the profile whose recent locations are to be fetched.
 * @returns A promise that resolves to a list of recent locations.
 */
export async function readRecentProfileLocations(
    profileId: string,
    filters: RecentLocationFilter = {},
): Promise<Location[]> {
    const endpoint = endpoints.profiles.locations.recent.replace('{id}', profileId.toString());

    const transformResponse = transformResponseFactory(parseLocationResponse);

    const { data } = await client.get<Location[]>(endpoint, {
        params: filters,
        transformResponse,
    });

    return data;
}
