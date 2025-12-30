import { translationToRequest } from '../../translation/translationHelpers';
import type { Tag, TagRequest } from '../tagSchemaTypes';

export function tagToRequest(tag: Tag): TagRequest {
    return {
        name: translationToRequest(tag.name),
        key: tag.key,
        icon: tag.icon,
    };
}
