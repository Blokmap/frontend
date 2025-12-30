import type { TagRequest } from './tagSchemaTypes';

export function defaultTagRequest(): TagRequest {
    return {
        name: {},
        key: '',
        icon: null,
    };
}
