import { doTimeRangesOverlap, minutesToTime, timeToMinutes } from '@/utils/time';
import type { Reservation, ReservationRequest } from '../types';

interface TimeRangeMinutes {
    start: number;
    end: number;
}

/**
 * Adjusts a reservation request to avoid overlapping with existing reservations.
 * If overlaps are detected, the start and end times are adjusted to fit into available gaps.
 *
 * @param request - The reservation request to adjust
 * @param existingReservations - Array of existing reservations (including both persisted and pending)
 * @returns The adjusted reservation request with non-overlapping times
 */
export function adjustReservationForOverlaps(
    request: ReservationRequest,
    existingReservations: (Reservation | ReservationRequest)[],
): ReservationRequest {
    const overlaps = getOverlappingReservations(request, existingReservations);

    if (overlaps.length === 0) {
        return { ...request };
    }

    const reqStart = timeToMinutes(request.startTime);
    const reqEnd = timeToMinutes(request.endTime);

    const { start: adjustedStart, end: adjustedEnd } = adjustTimeRange(
        { start: reqStart, end: reqEnd },
        overlaps,
    );

    return {
        ...request,
        startTime: minutesToTime(adjustedStart),
        endTime: minutesToTime(adjustedEnd),
    };
}

/**
 * Finds all reservations that overlap with the given request on the same day.
 */
function getOverlappingReservations(
    request: ReservationRequest,
    existingReservations: (Reservation | ReservationRequest)[],
): TimeRangeMinutes[] {
    return existingReservations
        .filter((r) => {
            return (
                r.day === request.day &&
                doTimeRangesOverlap(request.startTime, request.endTime, r.startTime, r.endTime)
            );
        })
        .map((r) => {
            return {
                start: timeToMinutes(r.startTime),
                end: timeToMinutes(r.endTime),
            };
        });
}

/**
 * Adjusts a time range to avoid overlapping with existing ranges.
 * If the start falls within an overlap, it's moved to the end of that overlap.
 * If the end falls after an overlap starts, it's moved to the start of that overlap.
 */
function adjustTimeRange(range: TimeRangeMinutes, overlaps: TimeRangeMinutes[]): TimeRangeMinutes {
    let adjustedStart = range.start;
    let adjustedEnd = range.end;

    // Move start to end of any conflict it falls within
    const startConflict = overlaps.find((r) => adjustedStart >= r.start && adjustedStart < r.end);

    if (startConflict) {
        adjustedStart = startConflict.end;
    }

    // Move end to start of first conflict after adjusted start
    const endConflict = overlaps.find((r) => r.start >= adjustedStart && r.start < adjustedEnd);

    if (endConflict) {
        adjustedEnd = endConflict.start;
    }

    return { start: adjustedStart, end: adjustedEnd };
}
