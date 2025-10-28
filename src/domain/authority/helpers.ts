import type { Authority, AuthorityRequest } from './types';

/**
 * Converts an Authority to an AuthorityRequest for editing.
 *
 * @param authority - The authority object to convert.
 * @returns An AuthorityRequest object suitable for forms.
 */
export function authorityToRequest(authority: Authority): AuthorityRequest {
    return {
        name: authority.name,
        description: authority.description,
    };
}
