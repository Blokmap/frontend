import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    createLocation,
    createLocationImage,
    createLocationOpenings,
    getLocationById,
    getNearestLocation,
    searchLocations,
    type LocationIncludes,
    type Location,
    type LocationSearchFilter,
    type LocationRequest,
    type NearestLocation,
    approveLocation,
    rejectLocation,
    type LocationFilter,
    listLocations,
    type LocationState,
    pendLocation,
    deleteLocation,
    updateLocation,
} from '@/domain/location';
import type { ImageRequest } from '@/domain/image';
import type { LngLat } from '@/domain/map';
import type { OpeningTimeRequest } from '@/domain/openings';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
    Paginated,
} from '@/types';

export const LOCATION_QUERY_KEYS = {
    read: (id: MaybeRef<number>) => ['location', toValue(id)],
} as const;

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @param options - Additional options for the query, such as initial data or query configuration.
 * @returns An object containing the search results and their state.
 */
export function useLocationsSearch(
    filters?: MaybeRef<LocationSearchFilter>,
    options: CompQueryOptions<LocationIncludes> = {},
): CompQuery<Paginated<Location>> {
    const { locale } = useI18n();

    const query = useQuery({
        ...options,
        queryKey: ['locations', 'search', filters, locale],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const params = toValue(filters);
            const language = toValue(locale);
            return await searchLocations(params, language);
        },
    });

    return query;
}

/**
 * Composable to fetch a list of locations based on filters.
 *
 * @param filters - The filters to apply when fetching locations.
 * @param options - Additional options for the query, such as initial data or query configuration.
 * @returns An object containing the list of locations and their state.
 */
export function useLocations(
    filters?: MaybeRef<LocationFilter>,
    options: CompQueryOptions<LocationIncludes> = {},
): CompQuery<Paginated<Location>> {
    const { locale } = useI18n();

    const query = useQuery({
        ...options,
        queryKey: ['locations', filters, locale],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const params = toValue(filters);
            const language = toValue(locale);
            const includes = options.includes ?? [];
            return await listLocations(params, language, includes);
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
export function useLocation(
    id: MaybeRef<number>,
    options: CompQueryOptions<LocationIncludes> = {},
): CompQuery<Location> {
    const query = useQuery({
        ...options,
        queryKey: LOCATION_QUERY_KEYS.read(id),
        queryFn: () => {
            const locationId = toValue(id);
            const includes = options.includes ?? [];
            return getLocationById(locationId, includes);
        },
    });

    return query;
}

/**
 * Composable to find the nearest location to a given coordinate.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for finding the nearest location.
 */
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
 * Composable to handle location creation.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for creating a location.
 */
export function useCreateLocation(
    options: CompMutationOptions = {},
): CompMutation<LocationRequest, Location> {
    const mutation = useMutation({
        ...options,
        mutationFn: createLocation,
    });

    return mutation;
}

export type UpdateLocationParams = {
    locationId: number;
    data: LocationRequest;
};

export function useUpdateLocation(
    options: CompMutationOptions = {},
): CompMutation<UpdateLocationParams, Location> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, data }: UpdateLocationParams) => {
            return updateLocation(locationId, data);
        },
    });

    return mutation;
}

export type CreateLocationImageParams = {
    locationId: number;
    image: ImageRequest;
};

/**
 * Composable to handle adding an image to a location.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for creating a location image.
 */
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

/**
 * Composable to handle creating opening time slots for a location.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for creating location timeslots.
 */
export function useCreateLocationTimeslots(
    options: CompMutationOptions = {},
): CompMutation<CreateLocationTimeslotsParams> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ locationId, timeslots }: CreateLocationTimeslotsParams) => {
            return createLocationOpenings(locationId, timeslots);
        },
    });

    return mutation;
}

/**
 * Composable to handle approving a location.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for approving a location.
 */
export function useApproveLocation(
    options: CompMutationOptions = {},
): CompMutation<number, Location> {
    const mutation = useMutation({
        ...options,
        mutationFn: approveLocation,
    });

    return mutation;
}

/**
 * Composable to handle rejecting a location.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for rejecting a location.
 */
export function useRejectLocation(
    options: CompMutationOptions = {},
): CompMutation<number, Location> {
    const mutation = useMutation({
        ...options,
        mutationFn: rejectLocation,
    });

    return mutation;
}

/**
 * Handle the deletion of a location.
 *
 * @param options - Mutation options.
 * @returns The mutation object for deleting a location.
 */
export function useDeleteLocation(options: CompMutationOptions = {}): CompMutation<number, void> {
    const mutation = useMutation({
        ...options,
        mutationFn: deleteLocation,
    });

    return mutation;
}

type LocationStateParams = {
    locationId: number;
    state: LocationState;
    reason?: string | null;
};

/**
 * Composable to handle changing a location's state (approved, rejected, or pending).
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating a location's state.
 */
export function useLocationState(
    options: CompMutationOptions = {},
): CompMutation<LocationStateParams, Location> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ locationId, state, reason }: LocationStateParams) => {
            if (state === 'approved') {
                return approveLocation(locationId);
            } else if (state === 'rejected') {
                return rejectLocation(locationId, reason);
            } else if (state === 'pending') {
                return pendLocation(locationId);
            }

            throw new Error(`Invalid state: ${state}`);
        },
    });

    return mutation;
}
