import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type Ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/store/useToast';
import { readAuthProfile, login, logout, register } from '@/domain/auth';
import type { LoginRequest, RegisterRequest } from '@/domain/auth';
import type { Profile } from '@/domain/profile';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { AxiosError } from 'axios';

export const AUTH_QUERY_KEYS = {
    profile: () => ['profile', 'details'],
};

/**
 * Composable to fetch the authenticated user's profile.
 *
 * @param options - Optional query options.
 * @returns The query object containing the profile data and its state.
 */
export function useAuthProfile(
    options: CompQueryOptions = {},
): CompQuery<Profile | null> & { profileId: Ref<number | null> } {
    const query = useQuery<Profile | null, AxiosError>({
        ...options,
        queryKey: AUTH_QUERY_KEYS.profile(),
        refetchInterval: 60000,
        retry: false,
        queryFn: readAuthProfile,
    });

    const profileId = computed(() => query.data.value?.id ?? null);

    return { ...query, profileId };
}

/**
 * Composable to log out the user.
 *
 * @param {CompMutationOptions} options - Optional mutation options.
 * @returns The mutation object for logging out.
 */
export function useAuthLogout(options: CompMutationOptions = {}): CompMutation<void> {
    const client = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: logout,
        onSuccess: (data, vars, context) => {
            toast.add({
                severity: 'success',
                summary: 'Uitgelogd',
                detail: 'Je bent succesvol uitgelogd.',
            });
            client.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile() });
            options.onSuccess?.(data, vars, context);
        },
    });

    return mutation;
}

/**
 * Composable to handle user login.
 *
 * @returns The mutation object for logging in.
 */
export function useAuthLogin(options: CompMutationOptions = {}): CompMutation<LoginRequest> {
    const client = useQueryClient();
    const toast = useToast();
    const router = useRouter();

    const mutation = useMutation({
        ...options,
        mutationFn: login,
        onSuccess: (data, vars, context) => {
            client.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile() });
            router.push({ name: 'auth.sso' });
            options.onSuccess?.(data, vars, context);
        },
        onError: (error, vars, context) => {
            toast.add({
                severity: 'error',
                summary: 'Inloggen mislukt',
                detail: 'Er is een fout opgetreden bij het inloggen.',
            });
            options.onError?.(error, vars, context);
        },
    });

    return mutation;
}

/**
 * Composable to handle user registration.
 *
 * @param {CompMutationOptions} options - Optional mutation options.
 *
 * @returns The mutation object for registering a new user.
 */
export function useAuthRegister(options: CompMutationOptions = {}): CompMutation<RegisterRequest> {
    const client = useQueryClient();

    const mutation = useMutation({
        ...options,
        mutationFn: register,
        onSuccess: (data, vars, context) => {
            client.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.profile() });
            options.onSuccess?.(data, vars, context);
        },
        onError: (error, vars, context) => {
            options.onError?.(error, vars, context);
        },
    });

    return mutation;
}
