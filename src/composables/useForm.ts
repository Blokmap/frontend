import useVuelidate from '@vuelidate/core';
import { ref, toValue, watchEffect, type MaybeRefOrGetter } from 'vue';

export type FormSyncer<R, S> = {
    syncFn: (source: S) => R;
    sync: MaybeRefOrGetter<S | undefined>;
};

export type Form<R> = ReturnType<typeof useForm<R, any>>;

export function useForm<R, S>(def: R, validation: object, syncer?: FormSyncer<R, S>) {
    const body = ref(def);
    const v$ = useVuelidate(validation, body);

    const sync = () => {
        if (syncer) {
            const { sync, syncFn } = syncer;
            const value = toValue(sync);
            body.value = value ? syncFn(value) : def;
        }
    };

    const reset = () => {
        sync();
        v$.value.$reset();
    };

    watchEffect(sync);

    return { body, v$, reset };
}
