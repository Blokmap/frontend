import { getAuthProfile, login, logout, register } from '@/services/auth';
import type { LoginRequest, RegisterRequest } from '@/types/schema/Auth';
import type { Profile } from '@/types/schema/Profile';
import {
    type MutationOptions,
    type QueryOptions,
    type UseMutationOptions,
    type UseQueryOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/vue-query';
import type { AxiosError } from 'axios';

export type UseAuthProfile = ReturnType<typeof useQuery<Profile | null>>;

/**
 * Composable to fetch the authenticated user's profile.
 *
 * @returns The query object containing the profile data and its state.
 */
export function useAuthProfile(
    options: Partial<UseQueryOptions<Profile | null>> = {},
): UseAuthProfile {
    const query = useQuery<Profile | null>({
        ...options,
        queryKey: ['profile'],
        throwOnError: false,
        retry: false,
        queryFn: getAuthProfile,
    });

    return query;
}

type UseAuthLogout = ReturnType<typeof useMutation<void, AxiosError>>;

/**
 * Composable to log out the user.
 *
 * @returns The mutation object for logging out.
 */
export function useAuthLogout(options: MutationOptions<void, AxiosError> = {}): UseAuthLogout {
    const client = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: logout,
        onSuccess: (data, vars, context) => {
            client.invalidateQueries({ queryKey: ['profile'] });
            options.onSuccess?.(data, vars, context);
        },
    });

    return mutation;
}

type UseAuthLogin = ReturnType<typeof useMutation<void, AxiosError, LoginRequest>>;

/**
 * Composable to handle user login.
 *
 * @returns The mutation object for logging in.
 */
export function useAuthLogin(
    options: MutationOptions<void, AxiosError, LoginRequest> = {},
): UseAuthLogin {
    const client = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: login,
        onSuccess: (data, vars, context) => {
            client.invalidateQueries({ queryKey: ['profile'] });
            options.onSuccess?.(data, vars, context);
        },
    });

    return mutation;
}

type UseAuthRegister = ReturnType<typeof useMutation<void, AxiosError, RegisterRequest>>;

/**
 * Composable to handle user registration.
 *
 * @param {UseMutationOptions<void, Error, RegisterRequest>} options - Optional mutation options.
 *
 * @returns The mutation object for registering a new user.
 */
export function useAuthRegister(
    options: MutationOptions<void, AxiosError, RegisterRequest> = {},
): UseAuthRegister {
    const client = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: register,
        onSuccess: (data, vars, context) => {
            client.invalidateQueries({ queryKey: ['profile'] });
            options.onSuccess?.(data, vars, context);
        },
    });

    return mutation;
}
