import type {
    MutationOptions,
    UseMutationReturnType,
    UseQueryOptions,
    UseQueryReturnType,
} from '@tanstack/vue-query';
import type { AxiosError } from 'axios';

export type CompQueryOptions = Partial<UseQueryOptions<any, any, any, any, any>>;
export type CompMutationOptions = Partial<MutationOptions<any, any, any, any>>;

export type CompQuery<T = unknown> = UseQueryReturnType<T, AxiosError | Error>;
export type CompMutation<T = void, V = void> = UseMutationReturnType<
    T,
    AxiosError | Error,
    V,
    unknown
>;
