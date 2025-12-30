import { stringToDate } from '@/utils/date';
import { parseProfileResponse } from '../profile';
import { parseTranslationResponse } from '../translation';
import type { Tag } from './tagSchemaTypes';

export function parseTagResponse(data: any): Tag {
    const result: Tag = {
        ...data,
        name: parseTranslationResponse(data.name),
        createdAt: stringToDate(data.createdAt),
        updatedAt: stringToDate(data.updatedAt),
    };

    if (data.updatedBy) {
        result.updatedBy = parseProfileResponse(data.updatedBy);
    }

    if (data.createdBy) {
        result.createdBy = parseProfileResponse(data.createdBy);
    }

    return result;
}
