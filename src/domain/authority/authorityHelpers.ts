import type { Authority, AuthorityBody } from './types';

/**
 * Converts an Authority to an AuthorityBody for editing.
 *
 * @param authority - The authority object to convert.
 * @returns An AuthorityBody object suitable for forms.
 */
export function authorityToRequest(authority: Authority): AuthorityBody {
    return {
        name: authority.name,
        description: authority.description,
        institutionId: authority.institution ? authority.institution.id : null,
    };
}
