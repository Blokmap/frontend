import {
    hasOverlapWithRanges,
    isTimeRangeValidBlockSize,
    isTimeRangeWithinBounds,
} from '@/utils/time/overlap';
import type { Reservation } from './types';
import type { OpeningTime } from '@/domain/openings';
import type { Time } from '@/utils/time';

export type ReservationValidationError =
    | { valid: false; error: 'INVALID_BLOCK_SIZE'; blockSize: number }
    | { valid: false; error: 'OUT_OF_BOUNDS' }
    | { valid: false; error: 'OVERLAP' }
    | { valid: true };

/**
 * Validates a reservation time range
 */
export function validateReservationTimeRange(
    startTime: Time,
    endTime: Time,
    openingTime: OpeningTime,
    existingReservations: Array<{ startTime: Time; endTime: Time }>,
    blockSizeMinutes: number,
): ReservationValidationError {
    if (!isTimeRangeValidBlockSize(startTime, endTime, blockSizeMinutes)) {
        return { valid: false, error: 'INVALID_BLOCK_SIZE', blockSize: blockSizeMinutes };
    }

    if (!isTimeRangeWithinBounds(startTime, endTime, openingTime.startTime, openingTime.endTime)) {
        return { valid: false, error: 'OUT_OF_BOUNDS' };
    }

    if (hasOverlapWithRanges(startTime, endTime, existingReservations)) {
        return { valid: false, error: 'OVERLAP' };
    }

    return { valid: true };
}

/**
 * Gets all reservation time ranges for an opening time, excluding deletions
 */
export function getReservationRanges(
    reservations: Reservation[],
    openingTimeId: number,
    excludeIds: number[] = [],
): Array<{ startTime: Time; endTime: Time }> {
    return reservations
        .filter((r) => r.openingTime?.id === openingTimeId && !excludeIds.includes(r.id))
        .map((r) => ({ startTime: r.startTime, endTime: r.endTime }));
}
