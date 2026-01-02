import { translationToRequest } from '@/domain/translation';
import type { Tag, TagRequest } from '../tagSchemaTypes';

export function tagToRequest(tag: Tag): TagRequest {
    return {
        name: translationToRequest(tag.name),
        key: tag.key,
        icon: tag.icon,
    };
}
