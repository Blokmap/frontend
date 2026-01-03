import type { TagRequest } from './tagSchemaTypes';

export function defaultTagRequest(): TagRequest {
    return {
        name: {},
        slug: '',
        icon: 'far bookmark',
    };
}
