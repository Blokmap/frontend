import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, type MaybeRefOrGetter, computed, toValue } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    createLocation,
    createLocationImage,
    readLocation,
    readNearestLocation,
    searchLocations,
    type LocationIncludes,
    type Location,
    type LocationSearchFilter,
    type LocationRequest,
    type NearestLocation,
    approveLocation,
    rejectLocation,
    type LocationFilter,
    readLocations,
    type LocationState,
    pendLocation,
    deleteLocation,
    updateLocation,
    deleteLocationImage,
    reorderLocationImages,
    readLocationReservations,
} from '@/domain/location';
import { readProfileLocations } from '@/domain/profile';
import { type Reservation } from '@/domain/reservation';
import type { ImageReorderRequest, ImageRequest } from '@/domain/image';
import type { LngLat } from '@/domain/map';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

export const LOCATION_QUERY_KEYS = {
    read: (id: MaybeRef<number>) => ['location', id] as const,
    list: (filters: MaybeRef<LocationFilter | undefined>, locale: MaybeRef<string>) =>
        ['locations', filters, locale] as const,
    search: (filters: MaybeRef<LocationSearchFilter | undefined>, locale: MaybeRef<string>) =>
        ['locations', 'search', filters, locale] as const,
    reservations: (locationId: MaybeRef<number | null>, inWeekOf: MaybeRefOrGetter<Date>) =>
        ['location', 'reservations', locationId, inWeekOf] as const,
    profileLocations: (profileId: MaybeRef<string | null>) =>
        ['profile', 'locations', profileId] as const,
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

            return await searchLocations({
                ...params,
                language,
            });
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
            const filtersValue = toValue(filters);
            const language = toValue(locale);
            const includes = options.includes ?? [];
            return await readLocations({ ...filtersValue, language }, includes);
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
            return readLocation(locationId, includes);
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
        mutationFn: readNearestLocation,
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

export type UpdateLocationImagesParams = {
    locationId: number;
    originalImages: ImageRequest[];
    currentImages: ImageRequest[];
};

/**
 * Composable to handle bulk image operations:
 * 1. Delete removed images
 * 2. Create new images in parallel
 * 3. Reorder existing images
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating location images.
 */
export function useUpdateLocationImages(
    options: CompMutationOptions = {},
): CompMutation<UpdateLocationImagesParams, void> {
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
        mutationFn: async ({
            locationId,
            originalImages,
            currentImages,
        }: UpdateLocationImagesParams) => {
            // Step 1: Delete removed images (those with id in original but not in current)
            const currentImageIds = new Set(
                currentImages.filter((img) => !!img.id).map((img) => img.id),
            );

            const imagesToDelete = originalImages
                .filter((img) => img.id !== undefined && !currentImageIds.has(img.id))
                .map((img) => img.id!);

            await Promise.all(
                imagesToDelete.map((imageId) => deleteLocationImage(locationId, imageId)),
            );

            // Step 2: Create new images in parallel (those without id)
            // New images are created with the correct index already from ImageRequest
            const newImages = currentImages.filter((img) => !img.id && img.file);

            await Promise.all(newImages.map((img) => createLocationImage(locationId, img)));

            // Step 3: Reorder ONLY existing images that weren't deleted
            // New images were created with correct index, no need to reorder them
            const reorders: ImageReorderRequest[] = currentImages
                .filter((img) => !!img.id)
                .map((img) => ({
                    imageId: img.id!,
                    index: img.index,
                }));

            if (reorders.length > 0) {
                await reorderLocationImages(locationId, reorders);
            }
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

/**
 * Composable to fetch reservations for a specific location within a given week.
 *
 * @param locationId - The ID of the location to fetch reservations for.
 * @param inWeekOf - The date within the week for which to fetch reservations.
 * @returns The query object containing location reservations and their state.
 */
export function useReadLocationReservations(
    locationId: MaybeRef<number | null>,
    inWeekOf: MaybeRefOrGetter<Date> = new Date(),
): CompQuery<Reservation[]> {
    const enabled = computed(() => toValue(locationId) !== null);

    const query = useQuery<Reservation[], AxiosError>({
        queryKey: LOCATION_QUERY_KEYS.reservations(locationId, inWeekOf),
        enabled,
        queryFn: () => {
            const locationIdValue = toValue(locationId)!;
            const inWeekOfValue = toValue(inWeekOf);
            return readLocationReservations(locationIdValue, { inWeekOf: inWeekOfValue });
        },
    });

    return query;
}

/**
 * Composable to fetch locations associated with a specific profile.
 *
 * @param profileId - The ID of the profile to fetch locations for.
 * @returns The query object containing profile locations and their state.
 */
export function useReadProfileLocations(profileId: MaybeRef<string | null>): CompQuery<Location[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Location[], AxiosError>({
        queryKey: LOCATION_QUERY_KEYS.profileLocations(profileId),
        enabled,
        queryFn: () => readProfileLocations(toValue(profileId)!),
    });

    return query;
}
