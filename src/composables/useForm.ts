import useVuelidate from '@vuelidate/core';
import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue';

export type FormSyncer<R, S> = {
    syncFn: (source: S) => R;
    sync: MaybeRefOrGetter<S | undefined>;
};

export function useForm<R, S>(def: R, validation: object, syncer?: FormSyncer<R, S>) {
    const form = ref<R>(def);
    const v$ = useVuelidate(validation, form);

    watchEffect(() => {
        if (syncer) {
            const { sync, syncFn } = syncer;
            const value = toValue(sync);
            form.value = value ? syncFn(value) : def;
        }
    });

    return { form, v$ };
}
