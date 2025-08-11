import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { LngLat } from '@/types/contract/Map';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location, NearestLocation } from '@/types/schema/Location';
import type { LocationRequest } from '@/types/schema/LocationRequest';
import type { Paginated } from '@/types/schema/Pagination';
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
export async function createLocation(locationData: LocationRequest): Promise<Location> {
    const response = await client.post(endpoints.locations.create, locationData);
    return response.data;
}
