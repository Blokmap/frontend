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
    deleteLocationImage,
    reorderLocationImages,
} from '@/domain/location';
import type { ImageReorderRequest, ImageRequest } from '@/domain/image';
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
    read: (id: MaybeRef<number>) => ['location', toValue(id)] as const,
    list: (filters: MaybeRef<LocationFilter | undefined>, locale: MaybeRef<string>) =>
        ['locations', filters, locale] as const,
    search: (filters: MaybeRef<LocationSearchFilter | undefined>, locale: MaybeRef<string>) =>
        ['locations', 'search', filters, locale] as const,
} as const;

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @param options - Additional options for the query, such as initial data or query configuration.
 * @returns An object containing the search results and their state.
 */
export function useSearchLocations(
    filters?: MaybeRef<LocationSearchFilter>,
    options: CompQueryOptions<LocationIncludes> = {},
): CompQuery<Paginated<Location>> {
    const { locale } = useI18n();

    const query = useQuery({
        ...options,
        queryKey: LOCATION_QUERY_KEYS.search(filters, locale),
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
export function useReadLocations(
    filters?: MaybeRef<LocationFilter>,
    options: CompQueryOptions<LocationIncludes> = {},
): CompQuery<Paginated<Location>> {
    const { locale } = useI18n();

    const query = useQuery({
        ...options,
        queryKey: LOCATION_QUERY_KEYS.list(filters, locale),
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
export function useReadLocation(
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all location lists
            queryClient.invalidateQueries({
                queryKey: ['locations'],
            });
            options.onSuccess?.(data, variables, context);
        },
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
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            // Invalidate all location lists
            queryClient.invalidateQueries({
                queryKey: ['locations'],
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, image }: CreateLocationImageParams) => {
            return createLocationImage(locationId, image);
        },
    });

    return mutation;
}

export type DeleteLocationImageParams = {
    locationId: number;
    imageId: number;
};

export function useDeleteLocationImage(
    options: CompMutationOptions = {},
): CompMutation<DeleteLocationImageParams, void> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, imageId }: DeleteLocationImageParams) => {
            return deleteLocationImage(locationId, imageId);
        },
    });

    return mutation;
}

export type ReorderLocationImagesParams = {
    locationId: number;
    reorders: ImageReorderRequest[];
};

export function useReorderLocationImages(
    options: CompMutationOptions = {},
): CompMutation<ReorderLocationImagesParams, void> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            options.onSuccess?.(data, variables, context);
        },
        mutationFn: async ({ locationId, reorders }: ReorderLocationImagesParams) => {
            return reorderLocationImages(locationId, reorders);
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            options.onSuccess?.(data, variables, context);
        },
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables),
            });
            // Invalidate all location lists
            queryClient.invalidateQueries({
                queryKey: ['locations'],
            });
            options.onSuccess?.(data, variables, context);
        },
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables),
            });
            // Invalidate all location lists
            queryClient.invalidateQueries({
                queryKey: ['locations'],
            });
            options.onSuccess?.(data, variables, context);
        },
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables),
            });
            // Invalidate all location lists
            queryClient.invalidateQueries({
                queryKey: ['locations'],
            });
            options.onSuccess?.(data, variables, context);
        },
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
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate the specific location query
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            // Invalidate all location lists
            queryClient.invalidateQueries({
                queryKey: ['locations'],
            });
            options.onSuccess?.(data, variables, context);
        },
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
