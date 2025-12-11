import {
    type MutationOptions,
    type UseMutationReturnType,
    type UseQueryOptions,
    type UseQueryReturnType,
} from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import type { Ref } from 'vue';

export type CompMutationOptions<D = any, V = any> = Partial<MutationOptions<D, AxiosError, V>> & {
    disableToasts?: boolean;
};

type UnwrapMaybeRef<T> = T extends Ref<infer U> ? U : T;

export type CompQueryOptions<I = string, D = any> = Partial<
    UnwrapMaybeRef<UseQueryOptions<D, AxiosError>>
> & {
    includes?: I[];
    disableToasts?: boolean;
    disableInvalidates?: boolean;
};

export type CompQuery<T = unknown> = UseQueryReturnType<T, AxiosError>;

export type CompMutation<T = any, V = any> = UseMutationReturnType<
    V,
    AxiosError | Error,
    T,
    unknown
>;
