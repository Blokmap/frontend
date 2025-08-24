import { useLocalStorage } from '@vueuse/core';

interface VersionedStorageData<T> {
    version: string;
    data: T;
}

interface UseVersionedLocalStorageOptions<T> {
    version?: string;
    defaults: T;
    dateFields?: (keyof T)[];
    arrayItemDateFields?: string[];
}

function generateVersion(defaults: any): string {
    const str = JSON.stringify(defaults);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
}

function syncStorageData<T extends Record<string, unknown>>(value: T, defaults: T): T {
    for (const key in value) {
        if (!(key in defaults)) {
            delete value[key];
        }
    }
    return { ...defaults, ...value };
}

function processDateFields<T>(
    data: T,
    dateFields: (keyof T)[] = [],
    arrayItemDateFields: string[] = [],
    serialize = false,
): T {
    const converted = { ...data };

    dateFields.forEach((field) => {
        const value = converted[field];
        if (!value) return;

        if (serialize && value instanceof Date) {
            converted[field] = value.toISOString() as any;
        } else if (!serialize && typeof value === 'string') {
            try {
                converted[field] = new Date(value) as any;
            } catch {}
        }
    });

    if (arrayItemDateFields.length && Array.isArray(converted)) {
        (converted as any[]).forEach((item) => {
            if (item && typeof item === 'object') {
                arrayItemDateFields.forEach((field) => {
                    const value = item[field];
                    if (!value) return;

                    if (serialize && value instanceof Date) {
                        item[field] = value.toISOString();
                    } else if (!serialize && typeof value === 'string') {
                        try {
                            item[field] = new Date(value);
                        } catch {}
                    }
                });
            }
        });
    }

    return converted;
}

export function useVersionedLocalStorage<T extends Record<string, any>>(
    key: string,
    options: UseVersionedLocalStorageOptions<T>,
) {
    const { defaults, dateFields = [], arrayItemDateFields = [] } = options;
    const version = options.version || generateVersion(defaults);

    const serializer = {
        read: (value: string): T => {
            try {
                if (!value) return { ...defaults };

                const parsed: VersionedStorageData<T> = JSON.parse(value);
                if (parsed.version !== version) {
                    return { ...defaults };
                }

                let data = parsed.data;
                if (dateFields.length || arrayItemDateFields.length) {
                    data = processDateFields(data, dateFields, arrayItemDateFields, false);
                }

                return syncStorageData(data, defaults);
            } catch {
                return { ...defaults };
            }
        },
        write: (value: T): string => {
            try {
                let data = value;
                if (dateFields.length || arrayItemDateFields.length) {
                    data = processDateFields(data, dateFields, arrayItemDateFields, true);
                }
                return JSON.stringify({ version, data });
            } catch {
                return JSON.stringify({ version, data: defaults });
            }
        },
    };

    return useLocalStorage(key, { ...defaults }, { serializer, writeDefaults: true });
}
