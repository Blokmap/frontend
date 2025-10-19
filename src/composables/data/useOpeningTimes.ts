import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type MaybeRef, type MaybeRefOrGetter, computed, toValue } from 'vue';
import {
    readOpeningTimes,
    createOpeningTimes,
    updateOpeningTime,
    deleteOpeningTime,
    deleteOpeningTimes,
    type OpeningTime,
    type OpeningTimeRequest,
    type OpeningTimeFilter,
} from '@/domain/openings';
import { LOCATION_QUERY_KEYS } from './useLocations';
import type { CompMutation, CompMutationOptions, CompQuery } from '@/types';
import type { AxiosError } from 'axios';

export const OPENING_TIME_QUERY_KEYS = {
    all: (locationId: MaybeRef<number>) => ['location', 'opening-times', locationId] as const,
    read: (locationId: MaybeRef<number | null>, filters: MaybeRefOrGetter<OpeningTimeFilter>) =>
        ['location', 'opening-times', locationId, filters] as const,
} as const;

/**
 * Composable to fetch opening times for a specific location within a given week.
 *
 * @param locationId - The ID of the location to fetch opening times for.
 * @param filters - The filters to apply when fetching opening times.
 * @returns An object containing the opening times and their state.
 */
export function useReadOpeningTimes(
    locationId: MaybeRef<number | null>,
    filters: MaybeRefOrGetter<OpeningTimeFilter> = {},
): CompQuery<OpeningTime[]> {
    const enabled = computed(() => toValue(locationId) !== null);

    const query = useQuery<OpeningTime[], AxiosError>({
        queryKey: OPENING_TIME_QUERY_KEYS.read(locationId, filters),
        enabled,
        queryFn: () => {
            const locationIdValue = toValue(locationId)!;
            const filtersValue = toValue(filters);
            return readOpeningTimes(locationIdValue, filtersValue);
        },
    });

    return query;
}

export type CreateOpeningTimesParams = {
    locationId: number;
    openings: OpeningTimeRequest[];
};

/**
 * Composable to handle creating multiple opening times for a location.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for creating opening times.
 */
export function useCreateOpeningTimes(
    options: CompMutationOptions = {},
): CompMutation<CreateOpeningTimesParams, OpeningTime[]> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all opening times queries for this location
            queryClient.invalidateQueries({
                queryKey: OPENING_TIME_QUERY_KEYS.all(variables.locationId),
            });

            // Also invalidate the location query to update embedded opening times
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, openings }: CreateOpeningTimesParams) => {
            return createOpeningTimes(locationId, openings);
        },
    });

    return mutation;
}

export type UpdateOpeningTimeParams = {
    locationId: number;
    openingTimeId: number;
    opening: OpeningTimeRequest;
    sequence?: boolean;
};

/**
 * Composable to handle updating a single opening time.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating an opening time.
 */
export function useUpdateOpeningTime(
    options: CompMutationOptions = {},
): CompMutation<UpdateOpeningTimeParams, OpeningTime> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all opening times queries for this location
            queryClient.invalidateQueries({
                queryKey: OPENING_TIME_QUERY_KEYS.all(variables.locationId),
            });
            // Also invalidate the location query to update embedded opening times
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, openingTimeId, opening, sequence }: UpdateOpeningTimeParams) => {
            return updateOpeningTime(locationId, openingTimeId, opening, sequence);
        },
    });

    return mutation;
}

export type DeleteOpeningTimeParams = {
    locationId: number;
    openingTimeId: number;
    sequence?: boolean;
};

/**
 * Composable to handle deleting a single opening time.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting an opening time.
 */
export function useDeleteOpeningTime(
    options: CompMutationOptions = {},
): CompMutation<DeleteOpeningTimeParams, void> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all opening times queries for this location
            queryClient.invalidateQueries({
                queryKey: OPENING_TIME_QUERY_KEYS.all(variables.locationId),
            });
            // Also invalidate the location query to update embedded opening times
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables.locationId),
            });
            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, openingTimeId, sequence }: DeleteOpeningTimeParams) => {
            return deleteOpeningTime(locationId, openingTimeId, sequence);
        },
    });

    return mutation;
}

/**
 * Composable to handle deleting all opening times for a location.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting all opening times.
 */
export function useDeleteAllOpeningTimes(
    options: CompMutationOptions = {},
): CompMutation<number, void> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all opening times queries for this location
            queryClient.invalidateQueries({
                queryKey: OPENING_TIME_QUERY_KEYS.all(variables),
            });
            // Also invalidate the location query to update embedded opening times
            queryClient.invalidateQueries({
                queryKey: LOCATION_QUERY_KEYS.read(variables),
            });
            options.onSuccess?.(data, variables, context);
        },
        mutationFn: deleteOpeningTimes,
    });

    return mutation;
}
