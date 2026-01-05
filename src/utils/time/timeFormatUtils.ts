import { timeToString } from './timeConvertUtils';
import type { Time } from './timeTypes';

/**
 * Formats a Time object to a string in HH:MM format.
 * This is an alias for timeToString for consistency with date formatting.
 *
 * @param time - The Time object to format.
 * @param compact - If true, returns a compact format (e.g., "14u" or "14u30").
 * @returns A string in HH:MM format or compact format.
 */
export function formatTime(
    time?: Time | null,
    compact: boolean = false,
): string | undefined | null {
    return timeToString(time, compact);
}

/**
 * Formats a time range from start to end Time objects.
 *
 * @param startTime - The starting Time object.
 * @param endTime - The ending Time object.
 * @param compact - If true, returns a compact format.
 *
 * @returns A string representing the time range in "HH:MM - HH:MM" format.
 */
export function formatTimeRange(
    startTime?: Time,
    endTime?: Time,
    compact: boolean = false,
): string {
    const startTimeString = timeToString(startTime, compact);
    const endTimeString = timeToString(endTime, compact);
    return `${startTimeString}-${endTimeString}`;
}
