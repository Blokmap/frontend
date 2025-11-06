import type {
    MutationOptions,
    UseMutationReturnType,
    UseQueryOptions,
    UseQueryReturnType,
} from '@tanstack/vue-query';
import type { AxiosError } from 'axios';

export type CompMutationOptions<D = any, V = any> = Partial<
    MutationOptions<D, AxiosError | Error, V, any>
> & {
    disableToasts?: boolean;
};

export type CompQueryOptions<I = string> = Partial<UseQueryOptions<any, any, any, any, any>> & {
    includes?: I[];
    disableToasts?: boolean;
};

export type CompQuery<T = unknown> = UseQueryReturnType<T, AxiosError>;

export type CompMutation<T = any, V = any> = UseMutationReturnType<
    V,
    AxiosError | Error,
    T,
    unknown
>;
