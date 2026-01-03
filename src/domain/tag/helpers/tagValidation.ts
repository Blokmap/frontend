import { SUPPORTED_LOCALES } from '@/config/i18nConfig';
import { translationRequestRules } from '@/domain/translation/helpers';
import { v } from '@/utils/forms/validation';

export const tagRequestRules = {
    name: translationRequestRules(SUPPORTED_LOCALES, {
        required: v.required('name'),
        maxLength: v.maxLength('name', 100),
    }),
    slug: {
        required: v.required('key'),
        maxLength: v.maxLength('key', 30),
    },
    icon: {},
};
