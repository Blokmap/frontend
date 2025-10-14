import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { createReservation, deleteReservation } from '@/domain/reservation';
import type { Reservation } from '@/domain/reservation';
import type { CompMutation, CompMutationOptions } from '@/types';
import type { Time } from '@/utils/time';

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

/**
 * Composable to handle deleting a reservation.
 *
 * @param options - Additional options for the mutation.
 * @returns The mutation object for deleting a reservation.
 */
export function useDeleteReservation(
    options: CompMutationOptions = {},
): CompMutation<DeleteReservationParams, void> {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            // Invalidate location reservations queries
            queryClient.invalidateQueries({
                queryKey: ['location', 'reservations', variables.locationId],
            });

            // Invalidate profile reservations queries
            queryClient.invalidateQueries({
                queryKey: ['profile', 'reservations'],
            });

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, openingTimeId, reservationId }: DeleteReservationParams) => {
            return deleteReservation(locationId, openingTimeId, reservationId);
        },
    });

    return mutation;
}
