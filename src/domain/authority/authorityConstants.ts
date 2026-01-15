import type { AuthorityRequest } from './types';

export function defaultAuthorityRequest(): AuthorityRequest {
    return {
        name: '',
        description: '',
        institutionId: null,
    };
}
