import { useLocalStorage } from '@vueuse/core';

interface VersionedStorageData<T> {
    version: string;
    data: T;
}

interface UseVersionedLocalStorageOptions<T> {
    version?: string;
    defaults: T;
}

function generateVersion(defaults: unknown): string {
    const str = JSON.stringify(defaults);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

function convertDatesInValue(value: any, templateValue: any, deserialize: boolean): any {
    if (deserialize) {
        // Try to parse any string as a date
        if (typeof value === 'string') {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    } else {
        // When serializing, convert Date objects to ISO strings
        if (value instanceof Date) {
            return value.toISOString();
        }
    }

    // Handle arrays
    if (Array.isArray(value)) {
        return value.map((item) => convertDatesInValue(item, null, deserialize));
    }

    // Handle objects
    if (value && typeof value === 'object' && value.constructor === Object) {
        const result: any = {};
        for (const key in value) {
            if (value.hasOwnProperty(key)) {
                result[key] = convertDatesInValue(value[key], null, deserialize);
            }
        }
        return result;
    }

    return value;
}

export function useVersionedLocalStorage<T>(
    key: string,
    options: UseVersionedLocalStorageOptions<T>,
) {
    const { defaults } = options;
    const version = options.version || generateVersion(defaults);

    const serializer = {
        read: (value: string): T => {
            if (!value) {
                return JSON.parse(JSON.stringify(defaults)) as T;
            }

            try {
                const parsed: VersionedStorageData<T> = JSON.parse(value);

                if (parsed.version !== version) {
                    return JSON.parse(JSON.stringify(defaults)) as T;
                }

                return convertDatesInValue(parsed.data, null, true) as T;
            } catch {
                return JSON.parse(JSON.stringify(defaults)) as T;
            }
        },

        write: (value: T): string => {
            try {
                const serialized = convertDatesInValue(value, null, false);
                return JSON.stringify({ version, data: serialized });
            } catch {
                return JSON.stringify({ version, data: defaults });
            }
        },
    };

    return useLocalStorage(key, JSON.parse(JSON.stringify(defaults)) as T, {
        serializer,
        writeDefaults: true,
    });
}
