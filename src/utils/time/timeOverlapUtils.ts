import { timeToMinutes } from './index';
import type { Time } from './timeTypes';

/**
 * Checks if a time is within a given time range (inclusive).
 *
 * @param time - The time to check.
 * @param startTime - The start of the range.
 * @param endTime - The end of the range.
 * @returns True if the time is within the range, false otherwise.
 */
export function isTimeInRange(time: Time, startTime: Time, endTime: Time): boolean {
    const minutes = timeToMinutes(time);
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    return minutes >= startMinutes && minutes <= endMinutes;
}

/**
 * Checks if two time ranges overlap.
 *
 * @param range1Start - Start time of the first range.
 * @param range1End - End time of the first range.
 * @param range2Start - Start time of the second range.
 * @param range2End - End time of the second range.
 * @returns True if the ranges overlap, false otherwise.
 */
export function doTimeRangesOverlap(
    range1Start: Time,
    range1End: Time,
    range2Start: Time,
    range2End: Time,
): boolean {
    const r1Start = timeToMinutes(range1Start);
    const r1End = timeToMinutes(range1End);
    const r2Start = timeToMinutes(range2Start);
    const r2End = timeToMinutes(range2End);

    // Two ranges overlap if one starts before the other ends
    return r1Start < r2End && r2Start < r1End;
}

/**
 * Checks if a time range overlaps with any time range in a list of ranges.
 *
 * @param startTime - Start time to check.
 * @param endTime - End time to check.
 * @param existingRanges - List of existing time ranges to check against.
 * @returns True if there is an overlap, false otherwise.
 */
export function hasOverlapWithRanges(
    startTime: Time,
    endTime: Time,
    existingRanges: Array<{ startTime: Time; endTime: Time }>,
): boolean {
    return existingRanges.some((range) =>
        doTimeRangesOverlap(startTime, endTime, range.startTime, range.endTime),
    );
}

/**
 * Validates that a time range is a multiple of the given block size in minutes.
 *
 * @param startTime - Start time to validate.
 * @param endTime - End time to validate.
 * @param blockSizeMinutes - The block size in minutes (e.g., 5, 15, 30).
 * @returns True if both start and end times are multiples of the block size, false otherwise.
 */
export function isTimeRangeValidBlockSize(
    startTime: Time,
    endTime: Time,
    blockSizeMinutes: number,
): boolean {
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    return startMinutes % blockSizeMinutes === 0 && endMinutes % blockSizeMinutes === 0;
}

/**
 * Validates that a time range is within the bounds of an opening time.
 *
 * @param startTime - Start time to validate.
 * @param endTime - End time to validate.
 * @param openingStart - Opening time start.
 * @param openingEnd - Opening time end.
 * @returns True if the range is within bounds, false otherwise.
 */
export function isTimeRangeWithinBounds(
    startTime: Time,
    endTime: Time,
    openingStart: Time,
    openingEnd: Time,
): boolean {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const openStart = timeToMinutes(openingStart);
    const openEnd = timeToMinutes(openingEnd);

    return start >= openStart && end <= openEnd && start < end;
}
