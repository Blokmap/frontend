import { type Ref, ref, watch } from 'vue';

type UseDebouncedLoading = Ref<boolean>;

/**
 * Composable to create a debounced loading state.
 *
 * @param loading - A reactive reference indicating the loading state.
 * @param delay - The debounce delay in milliseconds. Default is 300ms.
 * @returns A reactive reference that becomes true after the specified delay when loading starts.
 */
export function useDebouncedLoading(loading: Ref<boolean>, delay = 300): UseDebouncedLoading {
    const debounced = ref(loading.value);
    let timer: number | null = null;

    watch(
        loading,
        (v) => {
            if (v) {
                if (!timer) timer = setTimeout(() => (debounced.value = true), delay);
            } else {
                if (timer) {
                    clearTimeout(timer);
                    timer = null;
                }
                debounced.value = false;
            }
        },
        { immediate: true },
    );

    return debounced;
}
