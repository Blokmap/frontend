import { dateToString, isDateObject, isDateString, stringToDate } from './date';
import { timeToString, stringToTime, isTimeString, isTimeObject } from './time';
import type { Paginated } from '@/utils/pagination';

/**
 * Utility function to format an array of includes into a record.
 *
 * @param includes - Array of strings representing the includes to format.
 * @returns {Record<string, boolean>} - A record with the included properties set to true.
 */
export function formatIncludes(includes: string[] | null = []): Record<string, boolean> {
    const acc: Record<string, boolean> = {};

    for (const include of includes ?? []) {
        acc[include] = true;
    }

    return acc;
}

/**
 * Formats a request object by converting Date objects to strings.
 *
 * @param data - The request data object to format.
 * @param dayOnlyOverrides - Array of keys that should be formatted as date-only (YYYY-MM-DD) instead of date-time.
 * @returns {Record<string, any>} - The formatted request data object.
 */
export function formatRequest<T extends Record<string, any>>(
    data: T,
    dayOnlyOverrides: (keyof T)[] = [],
): Record<string, any> {
    const result: Record<string, any> = { ...data };

    for (const key in result) {
        const value = result[key];

        if (value === null || value === undefined) {
            delete result[key];
            continue;
        }

        if (isDateObject(value)) {
            result[key] = dateToString(value, dayOnlyOverrides.includes(key));
            continue;
        }

        if (isTimeObject(value)) {
            result[key] = timeToString(value);
            continue;
        }

        if (typeof value === 'object' && !Array.isArray(value)) {
            result[key] = formatRequest(value);
            continue;
        }

        if (Array.isArray(value)) {
            result[key] = value.map((d) => formatRequest(d, dayOnlyOverrides));
        }
    }

    return result;
}

/**
 * Formats a response object by converting date strings to Date objects and time strings to Time objects.
 * Inverse of formatRequest.
 *
 * @param data - The response data object to format.
 * @returns The formatted response data object.
 */
export function formatResponse<T extends Record<string, any>>(data: T): T {
    const result: Record<string, any> = { ...data };

    for (const key in result) {
        const value = result[key];

        if (value === null || value === undefined) {
            continue;
        }

        if (isDateString(value)) {
            result[key] = stringToDate(value, true);
            continue;
        }

        if (isTimeString(value)) {
            result[key] = stringToTime(value);
            continue;
        }

        if (Array.isArray(value)) {
            result[key] = value.map(formatResponse);
            continue;
        }

        if (typeof value === 'object') {
            result[key] = formatResponse(value);
            continue;
        }
    }

    return result as T;
}

/**
 * Creates a FormData request from a given data object.
 *
 * @param data - The data object to convert to FormData.
 * @returns {FormData} - The resulting FormData object.
 */
export function createFormDataRequest(data: Record<string, any>): FormData {
    const form = new FormData();
    const formatted = formatRequest(data);

    for (const key in formatted) {
        const value = formatted[key];
        form.append(key, value);
    }

    return form;
}

/**
 * Transforms a paginated response by parsing each item using the provided parser function.
 *
 * @param parser - A function that takes an item and returns the parsed item.
 * @returns A function that takes a JSON string and returns a Paginated object with parsed items.
 */
export function transformPaginatedResponse<T>(data: string): Paginated<T> {
    const parsed = JSON.parse(data);
    const items = parsed.data.map(formatResponse);
    return {
        ...parsed,
        data: items,
    };
}

/**
 * Transforms a response by parsing it using the provided parser function.
 *
 * @param parser - A function that takes an item and returns the parsed item.
 * @returns A function that takes a JSON string and returns the parsed item or array of items.
 */
export function transformResponse<T>(data: string): T | T[] | null {
    const parsed = JSON.parse(data);

    if (!data) return null;

    if (Array.isArray(parsed)) {
        return parsed.map(formatResponse);
    } else {
        return formatResponse(parsed);
    }
}
