import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRef, computed } from 'vue';
import { useToast } from '@/composables/store/useToast';
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
    type ReservationBody,
    type ReservationState,
} from '@/domain/reservation';
import { invalidateQueries } from './queryCache';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { Time } from '@/utils/time';
import type { AxiosError } from 'axios';

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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all reservations and related location queries
            invalidateQueries(queryClient, ['reservations', 'list'], data.id);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Reservatie aangemaakt',
                    detail: 'De reservatie is succesvol aangemaakt.',
                });
            }

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
    requests: ReservationBody[];
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
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all reservations
            invalidateQueries(queryClient, ['reservations', 'list']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Reservaties aangemaakt',
                    detail: `${data.length} reservatie(s) zijn succesvol aangemaakt.`,
                });
            }

            options.onSuccess?.(data, variables, context);
        },
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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all reservations queries
            invalidateQueries(queryClient, ['reservations', 'list'], variables.reservationId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Reservatie verwijderd',
                    detail: 'De reservatie is succesvol verwijderd.',
                });
            }

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
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all reservations
            invalidateQueries(queryClient, ['reservations', 'list']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Reservaties verwijderd',
                    detail: `${variables.reservationIds.length} reservatie(s) zijn succesvol verwijderd.`,
                });
            }

            options.onSuccess?.(data, variables, context);
        },
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
        queryKey: ['reservations', 'list', 'byLocation', locationId, filters],
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
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate reservations queries
            invalidateQueries(queryClient, ['reservations', 'list'], variables.reservationId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Reservatie bevestigd',
                    detail: 'De reservatie is succesvol bevestigd.',
                });
            }

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
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate all reservations
            invalidateQueries(queryClient, ['reservations'], variables.reservationId);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Reservatiestatus bijgewerkt',
                    detail: 'De status van de reservatie is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
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
    includes: ReservationIncludes[] = [],
): CompQuery<Reservation[]> {
    const enabled = computed(() => toValue(profileId) !== null);

    const query = useQuery<Reservation[], AxiosError>({
        queryKey: ['reservations', 'list', 'byProfile', profileId, filters, includes],
        enabled,
        placeholderData: keepPreviousData,
        queryFn: () => {
            const profileIdValue = toValue(profileId)!;
            const filtersValue = toValue(filters);
            const includesValue = toValue(includes);
            return readProfileReservations(profileIdValue, filtersValue, includesValue);
        },
    });

    return query;
}
