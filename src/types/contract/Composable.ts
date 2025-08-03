import type {
    MutationOptions,
    QueryOptions,
    UseMutationReturnType,
    UseQueryReturnType,
} from '@tanstack/vue-query';
import type { AxiosError } from 'axios';

export type CompQueryOptions = Partial<QueryOptions<any, any, any, any>>;
export type CompMutationOptions = Partial<MutationOptions<any, any, any, any>>;

export type CompQuery<T = unknown> = UseQueryReturnType<T, AxiosError | Error>;
export type CompMutation<T = any, V = any> = UseMutationReturnType<T, AxiosError, V, unknown>;
