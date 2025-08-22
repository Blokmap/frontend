import { endpoints } from '@/endpoints';
import type { LngLat } from '@/types/interfaces/Map';
import type { LocationFilter } from '@/types/schema/Filter';
import type { CreateImageRequest } from '@/types/schema/Image';
import type { CreateLocationRequest, Location, NearestLocation } from '@/types/schema/Location';
import type { CreateOpeningTimeRequest } from '@/types/schema/OpeningTime';
import type { Paginated } from '@/types/schema/Pagination';
import { client } from '@/utils/axios';
import { formatDate } from '@vueuse/core';

/**
 * Function to search for locations based on filters.
 *
 * @param {LocationFilter} [filters] - The filters to apply when searching for locations.
 * @param {string} [locale] - The locale to use for the search.
 * @returns {Promise<Paginated<Location>>} A promise that resolves to a paginated list of locations.
 */
export async function searchLocations(
    filters?: Partial<LocationFilter>,
    locale?: string,
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
    const language = locale;
    const openOnDay = filters?.openOn ? formatDate(filters.openOn, 'YYYY-MM-DD') : undefined;

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

    const response = await client.get(endpoints.locations.search, { params });

    return response.data;
}

/**
 * Function to get a location by its ID.
 *
 * @param {string} id - The ID of the location to fetch.
 * @returns {Promise<Location>} A promise that resolves to the location data.
 */
export async function getLocationById(id: string): Promise<Location> {
    const response = await client.get(endpoints.locations.read.replace('{id}', id));
    return response.data;
}

/** Function to get the nearest location based on a center point.
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
 * Function to create a new location.
 *
 * @param {LocationRequest} locationData - The location data to create.
 * @returns {Promise<Location>} A promise that resolves to the created location.
 */
export async function createLocation(locationData: CreateLocationRequest): Promise<Location> {
    const response = await client.post(endpoints.locations.create, locationData);
    return response.data;
}

/**
 * Function to set images for a location.
 *
 * @param {number} locationId - The ID of the location to set images for.
 * @param {CreateImageRequest} image - The images to set for the location.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function createLocationImage(
    locationId: number,
    image: CreateImageRequest,
): Promise<Location> {
    const formData = new FormData();

    if (image.file) {
        formData.append('image', image.file);
        formData.append('index', image.order.toString());
    }

    const response = await client.post(
        endpoints.locations.images.create.replace('{id}', locationId.toString()),
        formData,
    );

    return response.data;
}

/**
 * Function to update a location.
 *
 * @param {number} id - The ID of the location to update.
 * @param {CreateLocationRequest} locationData - The updated location data.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function updateLocation(
    id: number,
    locationData: CreateLocationRequest,
): Promise<Location> {
    const response = await client.put(
        endpoints.locations.update.replace('{id}', id.toString()),
        locationData,
    );
    return response.data;
}

/**
 * Function to delete a location by its ID.
 *
 * @param {number} id - The ID of the location to delete.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteLocation(id: number): Promise<void> {
    await client.delete(endpoints.locations.delete.replace('{id}', id.toString()));
}

/**
 * Function to create time slots for a location.
 *
 * @param {number} locationId - The ID of the location to create time slots for.
 * @param {CreateOpeningTimeRequest[]} openings - The opening times to create as time slots.
 * @returns {Promise<Location>} A promise that resolves to the updated location with new time slots.
 */
export async function createLocationTimeslots(
    locationId: number,
    openings: CreateOpeningTimeRequest[],
): Promise<Location> {
    const formatted = openings.map((opening) => {
        const day = formatDate(opening.day, 'YYYY-MM-DD');
        return { ...opening, day };
    });

    const response = await client.post(
        endpoints.locations.openingTimes.create.replace('{id}', locationId.toString()),
        formatted,
    );

    return response.data;
}
