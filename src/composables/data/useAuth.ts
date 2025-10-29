import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type Ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
    readAuthProfile,
    login,
    logout,
    register,
    readLocationMembers,
    readLocationRoles,
} from '@/domain/auth';
import type { LoginRequest, RegisterRequest, Membership, Role } from '@/domain/auth';
import type { Profile } from '@/domain/profile';
import type { CompMutation, CompMutationOptions, CompQuery, CompQueryOptions } from '@/types';
import type { AxiosError } from 'axios';

export const AUTH_QUERY_KEYS = {
    profile: () => ['profile', 'details'],
    locationMembers: (locationId: number) => ['location', locationId, 'members'],
    locationRoles: (locationId: number) => ['location', locationId, 'roles'],
};

/**
 * Composable to fetch the authenticated user's profile.
 *
 * @param options - Optional query options.
 * @returns The query object containing the profile data and its state.
 */
export function useAuthProfile(
    options: CompQueryOptions = {},
): CompQuery<Profile | null> & { profileId: Ref<string | null> } {
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

    const mutation = useMutation({
        ...options,
        mutationFn: logout,
        onSuccess: (data, vars, context) => {
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

/**
 * Composable to fetch members for a specific location.
 *
 * @param locationId - The ID of the location.
 * @param options - Optional query options.
 * @returns The query object containing the members data and its state.
 */
export function useReadLocationMembers(
    locationId: Ref<number>,
    options: CompQueryOptions = {},
): CompQuery<Membership[]> {
    const query = useQuery<Membership[], AxiosError>({
        ...options,
        queryKey: computed(() => AUTH_QUERY_KEYS.locationMembers(locationId.value)),
        queryFn: () => readLocationMembers(locationId.value),
    });

    return query;
}

/**
 * Composable to fetch roles for a specific location.
 *
 * @param locationId - The ID of the location.
 * @param options - Optional query options.
 * @returns The query object containing the roles data and its state.
 */
export function useReadLocationRoles(
    locationId: Ref<number>,
    options: CompQueryOptions = {},
): CompQuery<Role[]> {
    const query = useQuery<Role[], AxiosError>({
        ...options,
        queryKey: computed(() => AUTH_QUERY_KEYS.locationRoles(locationId.value)),
        queryFn: () => readLocationRoles(locationId.value),
    });

    return query;
}
