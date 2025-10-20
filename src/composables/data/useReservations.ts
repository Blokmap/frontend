import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRef } from 'vue';
import {
    confirmReservation,
    createReservation,
    deleteReservation,
    readLocationReservations,
} from '@/domain/reservation';
import type {
    Reservation,
    ReservationIncludes,
    ReservationFilter,
    ReservationState,
} from '@/domain/reservation';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Time } from '@/utils/time';

export const RESERVATION_QUERY_KEYS = {
    locationReservations: (locationId: MaybeRef<number>, filters?: MaybeRef<ReservationFilter>) =>
        ['location', 'reservations', locationId, filters] as const,
    profileReservations: () => ['profile', 'reservations'] as const,
} as const;

export type CreateReservationParams = {
    locationId: number;
    openingTimeId: number;
    startTime: Time;
    endTime: Time;
};

export type DeleteReservationParams = {
    locationId: number;
    openingTimeId: number;
    reservationId: number;
};

/**
 * Composable to handle creating a reservation.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for creating a reservation.
 */
export function useCreateReservation(
    options: CompMutationOptions = {},
): CompMutation<CreateReservationParams, Reservation> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate profile reservations queries
            queryClient.invalidateQueries({
                queryKey: RESERVATION_QUERY_KEYS.profileReservations(),
            });

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: (params: CreateReservationParams) => {
            const { locationId, openingTimeId, startTime, endTime } = params;
            return createReservation(locationId, openingTimeId, startTime, endTime);
        },
    });

    return mutation;
}

/**
 * Composable to handle deleting a reservation.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting a reservation.
 */
export function useDeleteReservation(
    options: CompMutationOptions = {},
): CompMutation<DeleteReservationParams> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate location reservations queries
            queryClient.invalidateQueries({
                queryKey: ['location', 'reservations'],
            });

            // Invalidate profile reservations queries
            queryClient.invalidateQueries({
                queryKey: RESERVATION_QUERY_KEYS.profileReservations(),
            });

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, openingTimeId, reservationId }: DeleteReservationParams) => {
            return deleteReservation(locationId, openingTimeId, reservationId);
        },
    });

    return mutation;
}

/**
 * Composable to fetch reservations for a specific location on a given date.
 *
 * @param locationId - The location ID.
 * @param filters - Optional filters to apply when fetching reservations.
 * @param options - Additional options for the query.
 * @returns The query object for fetching location reservations.
 */
export function useReadLocationReservations(
    locationId: MaybeRef<number>,
    filters?: MaybeRef<ReservationFilter>,
    options: CompQueryOptions = {},
): CompQuery<Reservation[]> {
    const query = useQuery({
        ...options,
        queryKey: RESERVATION_QUERY_KEYS.locationReservations(locationId, filters),
        queryFn: () => {
            const locationIdValue = toValue(locationId);
            const filtersValue = toValue(filters);
            const includes: ReservationIncludes[] = ['profile'];
            return readLocationReservations(locationIdValue, filtersValue, includes);
        },
    });

    return query;
}

export type ConfirmReservationParams = {
    locationId: number;
    reservationId: number;
};

/**
 * Composable to handle confirming a reservation.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for confirming a reservation.
 */
export function useConfirmReservation(
    options: CompMutationOptions = {},
): CompMutation<ConfirmReservationParams, Reservation> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate location reservations queries
            queryClient.invalidateQueries({
                queryKey: ['location', 'reservations'],
            });

            // Invalidate profile reservations queries
            queryClient.invalidateQueries({
                queryKey: RESERVATION_QUERY_KEYS.profileReservations(),
            });

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, reservationId }: ConfirmReservationParams) => {
            return confirmReservation(locationId, reservationId);
        },
    });

    return mutation;
}

type ReservationStateParams = {
    locationId: number;
    reservationId: number;
    state: ReservationState;
};

/**
 * Composable to handle changing a reservation's state.
 * Currently supports: Present (via confirmReservation).
 * TODO: Add service methods for Absent, Cancelled, and Created states when available.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for updating a reservation's state.
 */
export function useReservationState(
    options: CompMutationOptions = {},
): CompMutation<ReservationStateParams, Reservation> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate location reservations queries
            queryClient.invalidateQueries({
                queryKey: ['location', 'reservations'],
            });

            // Invalidate profile reservations queries
            queryClient.invalidateQueries({
                queryKey: RESERVATION_QUERY_KEYS.profileReservations(),
            });

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, reservationId, state }: ReservationStateParams) => {
            // Currently only Present state is supported via confirmReservation
            if (state === 'Present') {
                return confirmReservation(locationId, reservationId);
            }

            // TODO: Add support for other states when service methods are available:
            // - Absent: absentReservation(locationId, reservationId)
            // - Cancelled: cancelReservation(locationId, reservationId)
            // - Created: resetReservation(locationId, reservationId)

            throw new Error(`State change to "${state}" is not yet supported`);
        },
    });

    return mutation;
}
