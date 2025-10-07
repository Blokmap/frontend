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
 * Converts a Date object to its string representation in ISO format.
 *
 * @param date - The date to convert.
 * @returns The ISO string representation of the date.
 */
export function dateToString(date?: Date | null): string | undefined | null {
    if (!date) return date;
    return date.toISOString();
}
