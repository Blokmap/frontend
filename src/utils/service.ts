import { dateToString, isDateObject } from './date';
import { timeToString, isTimeObject } from './time';
import type { Paginated } from '@/utils/pagination';

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
    }

    return result;
}

/**
 * Creates a FormData request from a given data object.
 *
 * @param data - The data object to convert to FormData.
 * @returns {FormData} - The resulting FormData object.
 */
export function formatFormDataRequest(data: Record<string, any>): FormData {
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
export function transformPaginatedResponseFactory<T>(
    parser: (item: any) => T,
): (data: string) => Paginated<T> {
    return (data: string) => {
        const parsed = JSON.parse(data);
        const items = parsed.data.map(parser);
        return {
            ...parsed,
            data: items,
        };
    };
}

/**
 * Transforms a response by parsing it using the provided parser function.
 *
 * @param parser - A function that takes an item and returns the parsed item.
 * @returns A function that takes a JSON string and returns the parsed item or array of items.
 */
export function transformResponseFactory<T>(parser: (item: any) => T): (data: string) => T | T[] {
    return (data: string) => {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
            return parsed.map(parser);
        } else {
            return parser(parsed);
        }
    };
}
