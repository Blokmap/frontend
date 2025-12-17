import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, computed, toValue } from 'vue';
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
    type LocationFilter,
    readLocations,
    type LocationState,
    deleteLocation,
    updateLocation,
    updateLocationState,
    deleteLocationImage,
    reorderLocationImages,
    readAuthorityLocations,
    readInstitutionLocations,
    readRecentProfileLocations,
    type RecentLocationFilter,
    readProfileLocations,
} from '@/domain/location';
import {
    readLocationReservations,
    type Reservation,
    type ReservationFilter,
    type ReservationIncludes,
} from '@/domain/reservation';
import { useToast } from '../store/useToast';
import { invalidateQueries } from './queryCache';
import type { ImageReorderBody, ImageBody } from '@/domain/image';
import type { LngLat } from '@/domain/map';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { Paginated } from '@/utils/pagination';
import type { AxiosError } from 'axios';

/**
 * Composable to search for locations based on filters.
 *
 * @param filters - The filters to apply when searching for locations.
 * @param options - Additional options for the query, such as initial data or query configuration.
 * @returns An object containing the search results and their state.
 */
export function useSearchLocations(
    filters: MaybeRef<LocationSearchFilter> = {},
    options: CompQueryOptions<LocationIncludes> = {},
): CompQuery<Paginated<Location>> {
    const query = useQuery<Paginated<Location>, AxiosError>({
        ...options,
        queryKey: ['locations', 'list', filters],
        placeholderData: keepPreviousData,
        queryFn: async () => {
            const filtersValue = toValue(filters);

            return await searchLocations({
                ...filtersValue,
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

    const query = useQuery<Paginated<Location>, AxiosError>({
        ...options,
        queryKey: ['locations', 'list', filters, locale],
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
    const query = useQuery<Location, AxiosError>({
        ...options,
        queryKey: ['locations', 'read', id],
        queryFn: () => {
            const locationId = toValue(id);
            const includes = options.includes;
            return readLocation(locationId, includes);
        },
    });

    return query;
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
    filters: MaybeRef<ReservationFilter> = {},
    options: CompQueryOptions<ReservationIncludes> = {},
): CompQuery<Reservation[]> {
    const enabled = computed(() => toValue(locationId) !== null);

    const query = useQuery<Reservation[], AxiosError>({
        ...options,
        enabled,
        queryKey: ['reservations', 'list', 'byLocation', locationId, filters],
        queryFn: () => {
            const locationIdValue = toValue(locationId)!;
            const filtersValue = toValue(filters);
            const includesValue = options.includes;
            return readLocationReservations(locationIdValue, filtersValue, includesValue);
        },
    });

    return query;
}

/**
 * Composable to fetch locations associated with a specific authority.
 *
 * @param authorityId - The ID of the authority to fetch locations for.
 * @returns The query object containing authority locations and their state.
 */
export function useReadAuthorityLocations(
    authorityId: MaybeRef<number | null>,
    options: CompQueryOptions = {},
): CompQuery<Location[]> {
    const enabled = computed(() => toValue(authorityId) !== null);

    const query = useQuery<Location[], AxiosError>({
        ...options,
        queryKey: ['locations', 'list', 'byAuthority', authorityId],
        enabled,
        queryFn: () => readAuthorityLocations(toValue(authorityId)!),
    });

    return query;
}

export function useReadInstitutionLocations(
    institutionId: MaybeRef<number>,
    filters: MaybeRef<LocationFilter> = {},
    options: CompQueryOptions = {},
): CompQuery<Paginated<Location>> {
    const query = useQuery<Paginated<Location>, AxiosError>({
        ...options,
        queryKey: ['locations', 'list', 'byInstitution', institutionId, filters],
        queryFn: () => {
            const idValue = toValue(institutionId);
            const filtersValue = toValue(filters);
            return readInstitutionLocations(idValue, filtersValue);
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
    callback?: (lngLat: NearestLocation) => Promise<void>,
    options: CompMutationOptions = {},
): CompMutation<LngLat, NearestLocation> {
    const mutation = useMutation({
        ...options,
        mutationFn: async (center: LngLat) => {
            const nearest = await readNearestLocation(center);

            if (callback) {
                await callback(nearest);
            }

            return nearest;
        },
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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all location queries
            invalidateQueries(queryClient, ['locations']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Locatie aangemaakt',
                    detail: 'De locatie is succesvol aangemaakt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: createLocation,
    });

    return mutation;
}

export type UpdateLocationParams = {
    locationId: number;
    data: Partial<LocationRequest>;
};

export function useUpdateLocation(
    options: CompMutationOptions = {},
): CompMutation<UpdateLocationParams, Location> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate only queries that contain this location
            const { locationId } = variables;

            invalidateQueries(queryClient, ['locations'], locationId);
            invalidateQueries(queryClient, ['memberships', 'list', 'locations', 'byProfile']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Locatie bijgewerkt',
                    detail: 'De locatie is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            if (!options.disableToasts) {
                toast.add({
                    severity: 'error',
                    summary: 'Fout bij bijwerken locatie',
                    detail: 'Er was een fout bij het bijwerken van de locatie. ',
                });
            }

            options.onError?.(error, variables, context);
        },
        mutationFn: ({ locationId, data }: UpdateLocationParams) => {
            return updateLocation(locationId, data);
        },
    });

    return mutation;
}

export type CreateLocationImageParams = {
    locationId: number;
    image: ImageBody;
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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Add the new image to the specific location query
            const { locationId } = variables;

            invalidateQueries(queryClient, ['locations'], locationId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Locatie afbeelding toegevoegd',
                    detail: 'De locatie afbeelding is succesvol toegevoegd.',
                });
            }

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
            // Invalidate specific location query
            const { locationId } = variables;

            invalidateQueries(queryClient, ['locations'], locationId);

            if (!options.disableToasts) {
                const toast = useToast();

                toast.add({
                    severity: 'success',
                    summary: 'Locatie afbeelding verwijderd',
                    detail: 'De locatie afbeelding is succesvol verwijderd.',
                });
            }

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
    reorders: ImageReorderBody[];
};

export function useReorderLocationImages(
    options: CompMutationOptions = {},
): CompMutation<ReorderLocationImagesParams, void> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate specific location query
            const { locationId } = variables;

            invalidateQueries(queryClient, ['locations'], locationId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Locatie afbeeldingen bijgewerkt',
                    detail: 'De locatie afbeeldingen zijn succesvol bijgewerkt.',
                });
            }

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
    originalImages: ImageBody[];
    currentImages: ImageBody[];
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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate specific location query
            const { locationId } = variables;

            invalidateQueries(queryClient, ['locations'], locationId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Locatie afbeeldingen bijgewerkt',
                    detail: 'De locatie afbeeldingen zijn succesvol bijgewerkt.',
                });
            }

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
            // New images are created with the correct index already from ImageBody
            const newImages = currentImages.filter((img) => !img.id && img.file);

            await Promise.all(newImages.map((img) => createLocationImage(locationId, img)));

            // Step 3: Reorder ONLY existing images that weren't deleted
            // New images were created with correct index, no need to reorder them
            const reorders: ImageReorderBody[] = currentImages
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

type UpdateLocationStateParams = {
    locationId: number;
    state: LocationState;
    reason?: string | null;
};

/**
 * Composable to handle updating a location's state (approved, rejected, or pending).
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating a location's state.
 */
export function useUpdateLocationState(
    options: CompMutationOptions = {},
): CompMutation<UpdateLocationStateParams, void> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all queries containing this location
            const { locationId } = variables;

            invalidateQueries(queryClient, ['locations'], locationId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Locatie status bijgewerkt',
                    detail: `De status van de locatie is bijgewerkt naar ${variables.state}.`,
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, state, reason }: UpdateLocationStateParams) =>
            updateLocationState(locationId, { state, reason }),
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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: deleteLocation,
        onSuccess: (data, variables, context) => {
            // Remove the location from all queries
            const locationId = variables;

            invalidateQueries(queryClient, ['locations', 'list'], locationId);
            invalidateQueries(queryClient, ['memberships', 'list', 'locations', 'byProfile']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Locatie verwijderd',
                    detail: 'De locatie is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
            if (!options.disableToasts) {
                toast.add({
                    severity: 'error',
                    summary: 'Fout bij verwijderen locatie',
                    detail: 'Er was een fout bij het verwijderen van de locatie.',
                });
            }

            options.onError?.(error, variables, context);
        },
    });

    return mutation;
}

export function useReadProfileLocations(
    profileId: MaybeRef<string | null>,
    filters: MaybeRef<LocationFilter> = {},
    options: CompQueryOptions<LocationIncludes> = {},
): CompQuery<Paginated<Location>> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Paginated<Location>, AxiosError>({
        ...options,
        enabled,
        queryKey: ['locations', 'list', 'byProfile', profileId, filters],
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            const filtersValue = toValue(filters);
            const includes = options.includes;
            return readProfileLocations(profileIdValue, filtersValue, includes);
        },
    });

    return query;
}

export function useReadRecentProfileLocations(
    profileId: MaybeRef<string | null>,
    filters: MaybeRef<RecentLocationFilter> = {},
    options: CompQueryOptions = {},
): CompQuery<Location[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Location[], AxiosError>({
        ...options,
        enabled,
        queryKey: ['locations', 'list', 'byProfile', 'recent', profileId, filters],
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            const filtersValue = toValue(filters);
            return readRecentProfileLocations(profileIdValue, filtersValue);
        },
    });

    return query;
}
