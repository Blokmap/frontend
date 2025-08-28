import { useToast } from '@/composables/useToast';
import type { LoginRequest, Profile, RegisterRequest } from '@/domain/profile';
import { getAuthProfile, login, logout, register } from '@/services/auth';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/types/Composable';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import type { AxiosError } from 'axios';
import { type Ref, computed } from 'vue';

/**
 * Composable to fetch the authenticated user's profile.
 *
 * @returns The query object containing the profile data and its state.
 */
export function useAuthProfile(
    options: CompQueryOptions = {},
): CompQuery<Profile | null> & { profileId: Ref<number | null> } {
    const query = useQuery<Profile | null, AxiosError>({
        ...options,
        queryKey: ['profile', 'details'],
        throwOnError: false,
        refetchInterval: 60000,
        retry: false,
        queryFn: getAuthProfile,
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
            client.invalidateQueries({ queryKey: ['profile'] });
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
            client.invalidateQueries({ queryKey: ['profile'] });
            options.onSuccess?.(data, vars, context);
        },
    });

    return mutation;
}
