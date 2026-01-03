import { formatDate } from '@vueuse/core';
import { dateToString } from '../date';
import { timeToString } from '../time';

export * from './filterTypes';

export function formatFilters<T extends Record<string, any>>(
    filters: T,
    dateOnlyOverrides: (keyof T)[] = [],
): Record<string, any> {
    const result: Record<string, any> = { ...filters };

    for (const key in result) {
        const value = result[key];

        // Remove null or undefined values
        if (!value) {
            delete result[key];
            continue;
        }

        // Format dates to strings
        if (value instanceof Date) {
            if (dateOnlyOverrides.includes(key)) {
                result[key] = formatDate(value, 'YYYY-MM-DD');
            } else {
                result[key] = dateToString(value);
            }
            continue;
        }

        // Format times to HH:MM strings
        if (typeof value === 'object' && 'hours' in value && 'minutes' in value) {
            result[key] = timeToString(value);
        }
    }

    return result;
}
