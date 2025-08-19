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

/**
 * Parses a time string in various formats to an object with hours and minutes.
 * Supports both 12-hour (AM/PM) and 24-hour formats.
 *
 * @param timeString - The time string to parse (e.g., "14:30", "2:30 PM").
 * @returns An object with hours and minutes in 24-hour format.
 */
export function parseTimeString(timeString: string): { hours: number; minutes: number } {
    if (timeString.includes('AM') || timeString.includes('PM')) {
        const cleanTime = timeString.replace(/\s*(AM|PM)/i, '');
        const [hourStr, minuteStr] = cleanTime.split(':');

        let hours = parseInt(hourStr);
        const minutes = parseInt(minuteStr) || 0;

        // Convert to 24-hour format
        const isPM = timeString.includes('PM');

        if (isPM && hours !== 12) {
            hours += 12;
        } else if (!isPM && hours === 12) {
            hours = 0;
        }

        return { hours, minutes };
    }

    const [hours, minutes] = timeString.split(':').map(Number);
    return { hours, minutes };
}

/**
 * Converts hours and minutes to total minutes.
 *
 * @param hours - The hours.
 * @param minutes - The minutes.
 * @returns Total minutes.
 */
export function toTotalMinutes(hours: number, minutes: number): number {
    return hours * 60 + minutes;
}

/**
 * Converts total minutes to hours and minutes.
 *
 * @param totalMinutes - The total minutes.
 * @returns An object with hours and minutes.
 */
export function fromTotalMinutes(totalMinutes: number): { hours: number; minutes: number } {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}

/**
 * Adds time to a Date object following the same pattern as addToDate.
 *
 * @param date - The base date.
 * @param amount - The amount to add.
 * @param unit - The unit to add ('minutes', 'hours').
 * @returns A new Date object with the time added.
 */
export function addToTime(date: Date, amount: number, unit: 'minutes' | 'hours'): Date {
    const newDate = new Date(date);

    switch (unit) {
        case 'minutes':
            newDate.setMinutes(newDate.getMinutes() + amount);
            break;
        case 'hours':
            newDate.setHours(newDate.getHours() + amount);
            break;
    }

    return newDate;
}

/**
 * Creates a new Date object with specific time set on a given date.
 *
 * @param date - The base date.
 * @param hours - The hours to set.
 * @param minutes - The minutes to set.
 * @returns A new Date object with the time set.
 */
export function setTimeOnDate(date: Date, hours: number, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setHours(hours, minutes, 0, 0);
    return newDate;
}
