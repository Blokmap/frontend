import { client } from '@/config/axios';
import { endpoints } from '@/config/endpoints';
import { parseProfile } from '@/domain/profile';
import type { LoginRequest, RegisterRequest } from './types';
import type { Profile } from '@/domain/profile';

/**
 * Fetches the authenticated user's profile.
 *
 * @returns The authenticated user's profile or null if not authenticated.
 */
export async function getAuthProfile(): Promise<Profile | null> {
    const { data } = await client.get(endpoints.auth.current);
    if (data === null) return null;
    return parseProfile(data);
}

/**
 * Registers a new user with the provided registration details.
 *
 * @param request - The registration request containing user details.
 * @returns A promise that resolves when the registration is successful.
 */
export async function register(request: RegisterRequest): Promise<void> {
    await client.post(endpoints.auth.register, request);
}

/**
 * Logs in the user with the provided credentials.
 *
 * @param request - The login request containing email and password.
 * @returns A promise that resolves when the login is successful.
 */
export async function login(request: LoginRequest): Promise<void> {
    await client.post(endpoints.auth.login, request);
}

/**
 * Logs out the user by invalidating the current session.
 *
 * @returns A promise that resolves when the logout is successful.
 */
export async function logout(): Promise<void> {
    await client.post(endpoints.auth.logout);
}
