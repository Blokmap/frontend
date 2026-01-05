import { translationToRequest } from '@/domain/translation';
import type { Tag, TagRequest } from '../tagSchemaTypes';

export function tagToRequest(tag: Tag): TagRequest {
    return {
        name: translationToRequest(tag.name),
        slug: tag.slug,
        icon: tag.icon,
    };
}
