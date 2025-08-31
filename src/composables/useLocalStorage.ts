import { useLocalStorage as _useLocalStorage } from '@vueuse/core';

interface VersionedStorageData<T> {
    version: string;
    data: T;
}

interface UseVersionedLocalStorageOptions<T> {
    version?: string;
    defaults: T;
    dateFields?: string[];
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

function convertDates(value: any, dateFields: string[], deserialize: boolean): any {
    if (!dateFields?.length || !value || typeof value !== 'object') {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map((item) => convertDates(item, dateFields, deserialize));
    }

    const result = { ...value };

    for (const field of dateFields) {
        if (field in result) {
            if (deserialize && typeof result[field] === 'string') {
                result[field] = new Date(result[field]);
            } else if (!deserialize && result[field] instanceof Date) {
                result[field] = result[field].toISOString();
            }
        }
    }

    return result;
}

export function useLocalStorage<T>(key: string, options: UseVersionedLocalStorageOptions<T>) {
    const { defaults, dateFields = [] } = options;
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

                return convertDates(parsed.data, dateFields, true) as T;
            } catch {
                return JSON.parse(JSON.stringify(defaults)) as T;
            }
        },

        write: (value: T): string => {
            try {
                const serialized = convertDates(value, dateFields, false);
                return JSON.stringify({ version, data: serialized });
            } catch {
                return JSON.stringify({ version, data: defaults });
            }
        },
    };

    return _useLocalStorage(key, JSON.parse(JSON.stringify(defaults)) as T, {
        serializer,
        writeDefaults: true,
    });
}
