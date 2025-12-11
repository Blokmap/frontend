import { computed, ref, watchEffect, type Ref, type MaybeRefOrGetter, toValue } from 'vue';

export interface DirtyFormOptions<TSource, TForm> {
    /**
     * The source data to track (e.g., location, authority, institution)
     */
    source: MaybeRefOrGetter<TSource | null | undefined>;

    /**
     * Function to convert source data to form data
     */
    toForm: (source: TSource) => TForm;

    /**
     * Function to perform the save/update operation
     * Should return a Promise
     */
    onSave: (form: TForm) => Promise<void> | void;

    /**
     * Whether the save operation is currently pending
     */
    isPending: Ref<boolean>;
}

export interface DirtyFormReturn<TForm> {
    /**
     * The form data (reactive ref)
     */
    form: Ref<TForm | null>;

    /**
     * Whether the form has unsaved changes
     */
    hasChanges: Readonly<Ref<boolean>>;

    /**
     * Whether the save operation is in progress
     */
    isUpdating: Readonly<Ref<boolean>>;

    /**
     * Save the changes to the form
     */
    saveChanges: () => Promise<void>;

    /**
     * Cancel changes and reset the form to original state
     */
    cancelChanges: () => void;
}

/**
 * Composable for managing dirty form state with save/cancel functionality.
 * ```
 */
export function useDirtyForm<TSource, TForm>({
    source,
    toForm,
    onSave,
    isPending,
}: DirtyFormOptions<TSource, TForm>): DirtyFormReturn<TForm> {
    const form = ref<TForm | null>(null) as Ref<TForm | null>;
    const originalFormSnapshot = ref<string>('');

    const isUpdating = computed(() => isPending.value);

    const hasChanges = computed(() => {
        if (!originalFormSnapshot.value) return false;
        const currentFormSnapshot = JSON.stringify(form.value);
        return currentFormSnapshot !== originalFormSnapshot.value;
    });

    // Initialize form when source changes
    watchEffect(() => {
        const sourceValue = toValue(source);
        if (sourceValue) {
            const formData = toForm(sourceValue);
            form.value = formData;
            originalFormSnapshot.value = JSON.stringify(formData);
        }
    });

    /**
     * Saves the changes made to the form.
     */
    async function saveChanges(): Promise<void> {
        if (!form.value) return;

        await onSave(form.value);

        // Update snapshot after successful save
        originalFormSnapshot.value = JSON.stringify(form.value);
    }

    /**
     * Cancels the changes and resets the form.
     */
    function cancelChanges(): void {
        if (originalFormSnapshot.value) {
            form.value = JSON.parse(originalFormSnapshot.value);
        }
    }

    return {
        form,
        hasChanges,
        isUpdating,
        saveChanges,
        cancelChanges,
    };
}
