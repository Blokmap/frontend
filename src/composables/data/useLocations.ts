import { endpoints } from '@/endpoints';
import {
    createLocation,
    createLocationImage,
    createLocationTimeslots,
    getLocationById,
    getNearestLocation,
    searchLocations,
} from '@/services/location';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/types/Composable';
import type { LngLat } from '@/types/Map';
import type { LocationFilter } from '@/types/Filter';
import type { ImageRequest } from '@/domain/image';
import type { Location, LocationRequest, NearestLocation } from '@/domain/location';
import type { OpeningTimeRequest } from '@/domain/openingTime';
import type { Paginated } from '@/types/Pagination';
import { client, getRandomDelay } from '@/utils/axios';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, toValue } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @param options - Additional options for the query, such as initial data or query configuration.
 * @returns An object containing the search results and their state.
 */
export function useLocationsSearch(
    filters?: MaybeRef<LocationFilter>,
    options: CompQueryOptions = {},
): CompQuery<Paginated<Location>> {
    const { locale } = useI18n();

    const query = useQuery({
        ...options,
        queryKey: ['locations', 'search', filters, locale],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const params = toValue(filters);
            await getRandomDelay(100, 250);
            return await searchLocations(params, locale.value);
        },
    });

    return query;
}

/**
 * Composable to fetch a single location by its ID.
 *
 * @param id - The ID of the location to fetch.
 * @returns An object containing the location and its state.
 */
export function useLocation(id: MaybeRef<string>): CompQuery<Location> {
    const query = useQuery({
        queryKey: ['location', id],
        queryFn: () => getLocationById(toValue(id)),
    });

    return query;
}

export function useNearestLocation(
    options: CompMutationOptions = {},
): CompMutation<LngLat, NearestLocation> {
    const mutation = useMutation({
        ...options,
        mutationFn: getNearestLocation,
    });

    return mutation;
}

/**
 * Composable to fetch tags for locations.
 *
 * @returns An object containing the tags and their state.
 */
export function useTags(): CompQuery<string[]> {
    const query = useQuery({
        queryKey: ['tags'],
        queryFn: async () => {
            const response = await client.get(endpoints.tags.list);
            return response.data;
        },
    });

    return query;
}

/**
 * Composable to handle location creation.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for creating a location.
 */
export function useCreateLocation(
    options: CompMutationOptions = {},
): CompMutation<LocationRequest, Location> {
    const client = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: createLocation,
    });

    return mutation;
}

export type CreateLocationImageParams = {
    locationId: number;
    image: ImageRequest;
};

export function useCreateLocationImage(
    options: CompMutationOptions = {},
): CompMutation<CreateLocationImageParams> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ locationId, image }: CreateLocationImageParams) => {
            return createLocationImage(locationId, image);
        },
    });

    return mutation;
}

export type CreateLocationTimeslotsParams = {
    locationId: number;
    timeslots: OpeningTimeRequest[];
};

export function useCreateLocationTimeslots(
    options: CompMutationOptions = {},
): CompMutation<CreateLocationTimeslotsParams> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ locationId, timeslots }: CreateLocationTimeslotsParams) => {
            return createLocationTimeslots(locationId, timeslots);
        },
    });

    return mutation;
}
