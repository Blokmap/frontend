import { client } from '@/config/axios';
import { Profile } from '@/types/model/Profile';
import type { LoginRequest } from '@/types/schema/Auth';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

/**
 * Composable to fetch the authenticated user's profile.
 *
 * @returns {ReturnType<typeof useQuery<Profile | null>>} The query object containing the profile data and its state.
 */
export function useAuthProfile(): ReturnType<typeof useQuery<Profile | null>> {
    return useQuery<Profile | null>({
        queryKey: ['profile'],
        queryFn: async () => {
            const response = await client.get('/auth/me');
            return Profile.parse(response.data);
        },
    });
}

/**
 * Composable to log out the user.
 *
 * @returns {ReturnType<typeof useMutation>} The mutation object for logging out.
 */
export function useAuthLogout(): ReturnType<typeof useMutation<void>> {
    const query = useQueryClient();

    return useMutation({
        mutationKey: ['logout'],
        mutationFn: async () => {
            await client.post('/auth/logout');
            await query.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}

/**
 * Composable to handle user login.
 *
 * @returns {ReturnType<typeof useMutation<void>>} The mutation object for logging in.
 */
export function useAuthLogin(): ReturnType<typeof useMutation<void, Error, LoginRequest>> {
    const query = useQueryClient();

    return useMutation({
        mutationKey: ['login'],
        mutationFn: async (credentials: LoginRequest) => {
            await client.post('/auth/login', credentials);
            await query.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}
