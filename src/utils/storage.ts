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
