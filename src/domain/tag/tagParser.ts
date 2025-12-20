import { stringToDate } from '@/utils/date';
import { parseProfileResponse } from '../profile';
import { parseTranslationResponse } from '../translation';
import type { Tag } from './tagSchemaTypes';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export const TAG_ICONS: Record<string, IconDefinition> = {};

export function parseTagResponse(data: any): Tag {
    const result: Tag = {
        ...data,
        name: parseTranslationResponse(data.name),
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
    };

    if (data.icon) {
        result.icon = TAG_ICONS[data.icon] ?? null;
    }

    if (data.updatedBy) {
        result.updatedBy = parseProfileResponse(data.updatedBy);
    }

    if (data.createdBy) {
        result.createdBy = parseProfileResponse(data.createdBy);
    }

    return result;
}
