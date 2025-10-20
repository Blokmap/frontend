import { formatDate } from '@vueuse/core';

/**
 * Converts a string representation of a date to a Date object.
 *
 * @param dateString - The date to convert.
 * @returns The Date object representation of the date.
 */
export function stringToDate(dateString?: string | null): Date | undefined | null {
    if (dateString === null) return null;
    if (dateString === undefined) return undefined;
    return new Date(dateString);
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
