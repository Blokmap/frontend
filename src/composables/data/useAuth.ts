import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { type Ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { readAuthProfile, login, logout, register } from '@/domain/auth';
import {
    type Role,
    readLocationRoles,
    readAuthorityRoles,
    readInstitutionRoles,
} from '@/domain/member';
import type { LoginBody, RegisterBody } from '@/domain/auth';
import type { Profile } from '@/domain/profile';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { AxiosError } from 'axios';

export const AUTH_QUERY_KEYS = {
    profile: () => ['profile', 'details'],
    locationRoles: (locationId: number) => ['location', locationId, 'roles'],
    authorityRoles: (authorityId: number) => ['authority', authorityId, 'roles'],
    institutionRoles: (institutionId: number) => ['institution', institutionId, 'roles'],
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
export function useAuthLogin(options: CompMutationOptions = {}): CompMutation<LoginBody> {
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
export function useAuthRegister(options: CompMutationOptions = {}): CompMutation<RegisterBody> {
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

/**
 * Composable to fetch roles for a specific authority.
 *
 * @param authorityId - The ID of the authority.
 * @param options - Optional query options.
 * @returns The query object containing the roles data and its state.
 */
export function useReadAuthorityRoles(
    authorityId: Ref<number>,
    options: CompQueryOptions = {},
): CompQuery<Role[]> {
    const query = useQuery<Role[], AxiosError>({
        ...options,
        queryKey: computed(() => AUTH_QUERY_KEYS.authorityRoles(authorityId.value)),
        queryFn: () => readAuthorityRoles(authorityId.value),
    });

    return query;
}

/**
 * Composable to fetch roles for a specific institution.
 *
 * @param institutionId - The ID of the institution.
 * @param options - Optional query options.
 * @returns The query object containing the roles data and its state.
 */
export function useReadInstitutionRoles(
    institutionId: Ref<number>,
    options: CompQueryOptions = {},
): CompQuery<Role[]> {
    const query = useQuery<Role[], AxiosError>({
        ...options,
        queryKey: computed(() => AUTH_QUERY_KEYS.institutionRoles(institutionId.value)),
        queryFn: () => readInstitutionRoles(institutionId.value),
    });

    return query;
}
