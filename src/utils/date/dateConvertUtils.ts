import { formatDate } from '@vueuse/core';
import type { DateGranularity } from './dateTypes';

/**
 * Checks if a string is a valid date string.
 *
 * @param value - The string to check.
 * @returns True if the string is a valid date, false otherwise.
 */
export function isDateString(value: string): boolean {
    // regex to match YYYY-MM-DD or ISO 8601 date strings
    const is =
        /^\d{4}-\d{2}-\d{2}$/.test(value) ||
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(value);
    return is;
}

/**
 * Checks if a value is a Date object.
 *
 * @param value - The value to check.
 * @returns True if the value is a Date object, false otherwise.
 */
export function isDateObject(value: any): value is Date {
    return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Converts a string representation of a date to a Date object.
 *
 * @param dateString - The date to convert.
 * @param normalize - If true, assumes the input is in UTC and normalizes to current timezone.
 * @returns The Date object representation of the date.
 */
export function stringToDate(dateString: any, normalize?: boolean): Date;
export function stringToDate(dateString: undefined, normalize?: boolean): undefined;
export function stringToDate(dateString: null, normalize?: boolean): null;
export function stringToDate(
    dateString?: string | null,
    normalize: boolean = false,
): Date | undefined | null {
    if (dateString === null) return null;
    if (dateString === undefined) return undefined;

    const date = new Date(dateString);

    if (normalize) {
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

/**
 * Adds a specified amount of time to a date based on the given granularity.
 *
 * @param date - The base date to add time to.
 * @param amount - The amount to add (can be negative for subtraction).
 * @param granularity - The unit of time to add ('day', 'week', or 'month').
 * @returns A new Date object with the specified amount added.
 */
export function addToDate(date: Date, amount: number, granularity: DateGranularity = 'day'): Date {
    const newDate = new Date(date);

    switch (granularity) {
        case 'day':
            newDate.setDate(newDate.getDate() + amount);
            break;
        case 'week':
            newDate.setDate(newDate.getDate() + amount * 7);
            break;
        case 'month':
            newDate.setMonth(newDate.getMonth() + amount);
            break;
    }

    return newDate;
}
