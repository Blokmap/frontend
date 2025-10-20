import { formatDate } from '@vueuse/core';

/**
 * Converts a string representation of a date to a Date object.
 *
 * @param dateString - The date to convert.
 * @param normalize - If true, assumes the input is in UTC and normalizes to current timezone.
 * @returns The Date object representation of the date.
 */
export function stringToDate(
    dateString?: string | null,
    normalize: boolean = false,
): Date | undefined | null {
    if (dateString === null) return null;
    if (dateString === undefined) return undefined;

    const date = new Date(dateString);

    if (normalize) {
        // Assume input is UTC and adjust to local timezone
        const offset = date.getTimezoneOffset();
        return new Date(date.getTime() - offset * 60 * 1000);
    }

    return date;
}

/**
 * Converts a Date object to its string representation in ISO format or 'YYYY-MM-DD' format.
 *
 * @param date - The date to convert.
 * @param dayOnly - Whether to return only the date part (YYYY-MM-DD) or the full ISO string.
 * @returns The ISO string representation of the date.
 */
export function dateToString(
    date?: Date | null,
    dayOnly: boolean = false,
): string | undefined | null {
    if (!date) {
        return date;
    }

    if (dayOnly) {
        return formatDate(date, 'YYYY-MM-DD');
    }

    return date.toISOString();
}
