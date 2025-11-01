import { InstitutionCategory, type InstitutionBody } from './types';

export const DEFAULT_INSTITUTION_REQUEST: InstitutionBody = {
    category: InstitutionCategory.Education,
    name: {
        en: '',
        nl: '',
    },
    slug: '',
    aclType: 'whitelist',
    city: null,
    zip: null,
    country: null,
    number: null,
    street: null,
    province: null,
    email: null,
    phoneNumber: null,
};

export const INSTITUTION_CATEGORIES = [
    InstitutionCategory.Education,
    InstitutionCategory.Organisation,
    InstitutionCategory.Government,
] as const;

export const ACL_TYPES = ['whitelist', 'blacklist'] as const;
