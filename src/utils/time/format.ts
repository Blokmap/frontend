import { timeToString as convertTimeToString } from './convert';
import type { Time } from './types';

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
    return convertTimeToString(time, compact);
}
