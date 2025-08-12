import type {
    UseMutationOptions,
    UseMutationReturnType,
    UseQueryOptions,
    UseQueryReturnType,
} from '@tanstack/vue-query';
import type { AxiosError } from 'axios';

export type CompQueryOptions = Partial<UseQueryOptions<any, any, any, any, any>>;
export type CompMutationOptions = Partial<UseMutationOptions<any, any, any, any>>;

export type CompQuery<T = unknown> = UseQueryReturnType<T, AxiosError | Error>;
export type CompMutation<T = void, V = void> = UseMutationReturnType<
    T,
    AxiosError | Error,
    V,
    unknown
>;
