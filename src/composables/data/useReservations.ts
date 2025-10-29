import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRef, computed } from 'vue';
import {
    confirmReservation,
    createReservation,
    createReservations,
    deleteReservation,
    deleteReservations,
    readLocationReservations,
    readProfileReservations,
    updateReservation,
    type Reservation,
    type ReservationFilter,
    type ReservationIncludes,
    type ReservationRequest,
    type ReservationState,
} from '@/domain/reservation';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { Time } from '@/utils/time';
import type { AxiosError } from 'axios';

export const RESERVATION_QUERY_KEYS = {
    locationReservations: (locationId: MaybeRef<number>, filters?: MaybeRef<ReservationFilter>) =>
        ['location', 'reservations', locationId, filters] as const,
    profileReservations: (
        profileId: MaybeRef<string | null>,
        filters?: MaybeRef<ReservationFilter>,
    ) => ['profile', 'reservations', profileId, filters] as const,
} as const;

export type CreateReservationParams = {
    locationId: number;
    openingTimeId: number;
    startTime: Time;
    endTime: Time;
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
            // Invalidate all profile reservations queries
            queryClient.invalidateQueries({
                queryKey: ['profile', 'reservations'],
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

export type CreateReservationsParams = {
    locationId: number;
    requests: ReservationRequest[];
};

/**
 * Composable to handle bulk creating reservations.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for creating multiple reservations.
 */
export function useCreateReservations(
    options: CompMutationOptions = {},
): CompMutation<CreateReservationsParams, Reservation[]> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ locationId, requests }: CreateReservationsParams) => {
            return createReservations(locationId, requests);
        },
    });

    return mutation;
}

export type DeleteReservationParams = {
    reservationId: string;
};

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
            // Invalidate all profile reservations queries
            queryClient.invalidateQueries({
                queryKey: ['profile', 'reservations'],
            });

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ reservationId }: DeleteReservationParams) => {
            return deleteReservation(reservationId);
        },
    });

    return mutation;
}

export type DeleteReservationsParams = {
    locationId: number;
    reservationIds: string[];
};

/**
 * Composable to handle bulk deleting reservations.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting multiple reservations.
 */
export function useDeleteReservations(
    options: CompMutationOptions = {},
): CompMutation<DeleteReservationsParams> {
    const mutation = useMutation({
        ...options,
        mutationFn: ({ locationId, reservationIds }: DeleteReservationsParams) => {
            return deleteReservations(locationId, reservationIds);
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
    reservationId: string;
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

            // Invalidate all profile reservations queries
            queryClient.invalidateQueries({
                queryKey: ['profile', 'reservations'],
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
    reservationId: string;
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
    const mutation = useMutation({
        ...options,
        mutationFn: ({ reservationId, state }: ReservationStateParams) => {
            return updateReservation(reservationId, {
                state,
            });
        },
    });

    return mutation;
}

/**
 * Composable to fetch reservations for a specific profile within a given week.
 *
 * @param profileId - The ID of the profile to fetch reservations for.
 * @param filters - Optional filters to apply when fetching reservations.
 * @returns The query object containing profile reservations and their state.
 */
export function useReadProfileReservations(
    profileId: MaybeRef<string | null>,
    filters: MaybeRef<ReservationFilter> = {},
): CompQuery<Reservation[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Reservation[], AxiosError>({
        queryKey: RESERVATION_QUERY_KEYS.profileReservations(profileId, filters),
        enabled,
        placeholderData: (previousData) => previousData,
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            const filtersValue = toValue(filters);

            return readProfileReservations(profileIdValue, filtersValue, [
                'location',
                'openingTime',
            ]);
        },
    });

    return query;
}
