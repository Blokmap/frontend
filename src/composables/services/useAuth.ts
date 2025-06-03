import { client } from '@/config/axios';
import { endpoints } from '@/endpoints';
import { Profile } from '@/types/model/Profile';
import type { LoginRequest, RegisterRequest } from '@/types/schema/Auth';
import {
    type MutationOptions,
    type UseMutationOptions,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/vue-query';
import type { AxiosError } from 'axios';

/**
 * Composable to fetch the authenticated user's profile.
 *
 * @returns The query object containing the profile data and its state.
 */
export function useAuthProfile() {
    const query = useQuery<Profile | null>({
        queryKey: ['profile'],
        retry: false,
        queryFn: async () => {
            try {
                const response = await client.get(endpoints.auth.current);
                return response.data;
            } catch {
                return null;
            }
        },
    });

    return {
        profile: query.data,
        profileError: query.error,
        profileIsLoading: query.isPending,
        profileIsSuccess: query.isSuccess,
        profileIsError: query.isError,
    };
}

/**
 * Composable to log out the user.
 *
 * @returns The mutation object for logging out.
 */
export function useAuthLogout(options: MutationOptions<void, AxiosError> = {}) {
    const query = useQueryClient();

    const mutation = useMutation({
        mutationKey: ['logout'],
        mutationFn: async () => {
            await client.post(endpoints.auth.logout);
            await query.invalidateQueries({ queryKey: ['profile'] });
        },
        ...options,
    });

    return {
        logoutError: mutation.error,
        logoutIsLoading: mutation.isPending,
        logoutIsSuccess: mutation.isSuccess,
        logoutIsError: mutation.isError,
        logout: mutation.mutateAsync,
    };
}

/**
 * Composable to handle user login.
 *
 * @returns The mutation object for logging in.
 */
export function useAuthLogin(options: MutationOptions<void, AxiosError, LoginRequest> = {}) {
    const query = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (credentials: LoginRequest) => {
            await client.post(endpoints.auth.login, credentials);
            await query.invalidateQueries({ queryKey: ['profile'] });
        },
        ...options,
    });

    return {
        loginError: mutation.error,
        loginIsLoading: mutation.isPending,
        loginIsSuccess: mutation.isSuccess,
        loginIsError: mutation.isError,
        login: mutation.mutateAsync,
    };
}

/**
 * Composable to handle user registration.
 *
 * @param {UseMutationOptions<void, Error, RegisterRequest>} options - Optional mutation options.
 *
 * @returns The mutation object for registering a new user.
 */
export function useAuthRegister(
    options: UseMutationOptions<void, AxiosError, RegisterRequest> = {},
) {
    const query = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (credentials: RegisterRequest) => {
            console.log('Registering with credentials:', credentials.password);
            await client.post(endpoints.auth.register, credentials);
            await query.invalidateQueries({ queryKey: ['profile'] });
        },
        ...options,
    });

    return {
        registerError: mutation.error,
        registerIsLoading: mutation.isPending,
        registerIsSuccess: mutation.isSuccess,
        registerIsError: mutation.isError,
        register: mutation.mutateAsync,
    };
}
