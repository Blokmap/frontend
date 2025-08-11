/**
 * Formats a Date object to a time string in HH:MM format.
 *
 * @param date - The date to format.
 * @returns A string representing the time in HH:MM format.
 */
export function formatTimeFromDate(date: Date): string {
    return date.toTimeString().slice(0, 5);
}

/**
 * Calculates the duration between two Date objects.
 *
 * @param startTime - The start time.
 * @param endTime - The end time.
 * @returns A Duration object with hours and minutes.
 */
export function calculateDuration(
    startTime: Date,
    endTime: Date,
): { hours: number; minutes: number } {
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    return {
        hours,
        minutes,
    };
}

/**
 * Formats a duration object into a human-readable string.
 *
 * @param duration - The duration to format.
 * @param locale - The locale to use for formatting (defaults to 'en').
 * @returns A formatted string representing the duration (e.g., "2h 30m").
 */
export function formatDuration(
    duration: { hours: number; minutes: number },
    locale = 'en',
): string {
    const parts: string[] = [];

    if (duration.hours > 0) {
        parts.push(`${duration.hours}h`);
    }

    if (duration.minutes > 0) {
        parts.push(`${duration.minutes}m`);
    }

    return parts.length > 0 ? parts.join(' ') : '0m';
}
