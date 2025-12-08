import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { type Profile, parseProfileResponse } from '@/domain/profile';
import { transformResponseFactory } from '@/utils/serviceUtils';
import type { RegisterBody, LoginBody } from '../types';

/**
 * Fetches the authenticated user's profile.
 *
 * @returns The authenticated user's profile or null if not authenticated.
 */
export async function readAuthProfile(): Promise<Profile | null> {
    const endpoint = endpoints.auth.current;

    const transformResponse = transformResponseFactory(parseProfileResponse);

    const { data } = await client.get(endpoint, {
        transformResponse,
    });

    if (data === null) return null;

    return data;
}

/**
 * Registers a new user with the provided registration details.
 *
 * @param request - The registration request containing user details.
 * @returns A promise that resolves when the registration is successful.
 */
export async function register(request: RegisterBody): Promise<void> {
    const endpoint = endpoints.auth.register;
    await client.post(endpoint, request);
}

/**
 * Logs in the user with the provided credentials.
 *
 * @param request - The login request containing email and password.
 * @returns A promise that resolves when the login is successful.
 */
export async function login(request: LoginBody): Promise<void> {
    const endpoint = endpoints.auth.login;
    await client.post(endpoint, request);
}

/**
 * Logs out the user by invalidating the current session.
 *
 * @returns A promise that resolves when the logout is successful.
 */
export async function logout(): Promise<void> {
    const endpoint = endpoints.auth.logout;
    await client.post(endpoint);
}
