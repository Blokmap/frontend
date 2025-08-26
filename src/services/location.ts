import type { LocationIncludes } from '@/composables/data/useLocations';
import type { ImageRequest } from '@/domain/image';
import type { Location, LocationRequest, NearestLocation } from '@/domain/location';
import type { OpeningTime, OpeningTimeRequest } from '@/domain/openings';
import { endpoints } from '@/endpoints';
import type { LocationFilter } from '@/types/Filter';
import type { LngLat } from '@/types/Map';
import type { Paginated } from '@/types/Pagination';
import { client, getRandomDelay } from '@/utils/axios';
import { dateToString, stringToDate } from '@/utils/date/date';
import { stringToTime, timeToString } from '@/utils/date/time';
import { formatIncludes } from '@/utils/service';
import { formatDate } from '@vueuse/core';

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
function parseLocation(locationData: any): Location {
    const location = { ...locationData };

    location.createdAt = stringToDate(location.createdAt);
    location.updatedAt = stringToDate(location.updatedAt);

    // Convert opening times if they exist
    if (location.openingTimes) {
        location.openingTimes = location.openingTimes.map(parseOpeningTime);
    }

    // Convert dates if they exist
    if (location.approvedAt) {
        location.approvedAt = stringToDate(location.approvedAt);
    }

    return location;
}

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

    const response = await client.get(endpoints.locations.search, { params });

    return {
        ...response.data,
        data: response.data.data.map(parseLocation),
    };
}

/**
 * Function to get a location by its ID.
 *
 * @param {string} id - The ID of the location to fetch.
 * @returns {Promise<Location>} A promise that resolves to the location data.
 */
export async function getLocationById(id: number, includes: LocationIncludes[]): Promise<Location> {
    const params = formatIncludes(includes);

    const response = await client.get(endpoints.locations.read.replace('{id}', id.toString()), {
        params,
    });

    return parseLocation(response.data);
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
export async function createLocation(locationData: LocationRequest): Promise<Location> {
    const response = await client.post(endpoints.locations.create, locationData);
    return parseLocation(response.data);
}

/**
 * Function to set images for a location.
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
 * Function to update a location.
 *
 * @param {number} id - The ID of the location to update.
 * @param {LocationRequest} locationData - The updated location data.
 * @returns {Promise<Location>} A promise that resolves to the updated location.
 */
export async function updateLocation(id: number, locationData: LocationRequest): Promise<Location> {
    const response = await client.put(
        endpoints.locations.update.replace('{id}', id.toString()),
        locationData,
    );
    return parseLocation(response.data);
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
 * Function to delete all opening times for a location.
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
 * Function to delete all images for a location.
 *
 * @param {number} locationId - The ID of the location to delete images for.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export async function deleteLocationImages(locationId: number): Promise<void> {
    await client.delete(
        endpoints.locations.images.deleteAll.replace('{id}', locationId.toString()),
    );
}
