import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import type { LocationFilter } from '@/types/schema/Filter';
import type { Location } from '@/types/schema/Location';
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
    const [southWest, northEast] = filters?.bounds || [];
    const northEastLng = northEast?.[0];
    const northEastLat = northEast?.[1];
    const southWestLng = southWest?.[0];
    const southWestLat = southWest?.[1];

    const centerLng = filters?.center?.coords?.[0];
    const centerLat = filters?.center?.coords?.[1];
    const distance = filters?.center?.radius;

    const query = filters?.query || undefined;
    const page = filters?.page;
    const perPage = filters?.perPage;
    const language = locale;
    const openOnDay = filters?.openOn ? formatDate(filters?.openOn, 'YYYY-MM-DD') : undefined;

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
