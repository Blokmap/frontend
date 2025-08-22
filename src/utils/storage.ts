/**
 * Synchronizes the storage data with the default values.
 * @param value The current storage value.
 * @param default The default values to merge with.
 */
export function syncStorageData<T extends Record<string, unknown>>(value: T, defaults: T) {
    // Remove storage fields not present on defaults and merge
    for (const key in value) {
        if (!(key in defaults)) {
            delete value[key];
        }
    }

    // Merge defaults with current storage value
    const merged = { ...defaults, ...value };

    return merged;
}

/**
 * Converts date strings back to Date objects in an array of objects.
 * Useful for localStorage data that has been serialized.
 * @param data Array of objects that may contain date strings
 * @param dateFields Array of field names that should be converted to Date objects
 */
export function deserializeDates<T extends Record<string, any>>(
    data: T[],
    dateFields: (keyof T)[],
): T[] {
    return data.map((item) => {
        const converted = { ...item };
        dateFields.forEach((field) => {
            if (converted[field] && typeof converted[field] === 'string') {
                converted[field] = new Date(converted[field] as string) as any;
            }
        });
        return converted;
    });
}
