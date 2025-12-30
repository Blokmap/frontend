import { SUPPORTED_LOCALES } from '@/config/i18nConfig';
import { translationToRequest } from '../translation/translationHelpers';
import type { Institution, InstitutionRequest } from './types';

/**
 * Converts an Institution to an InstitutionBody for editing.
 *
 * @param institution - The institution object to convert.
 * @returns An InstitutionBody object suitable for forms.
 */
export function institutionToRequest(institution: Institution): InstitutionRequest {
    return {
        category: institution.category,
        name: translationToRequest(institution.name),
        slug: institution.slug,
        aclType: institution.aclType,
        city: institution.city,
        zip: institution.zip,
        country: institution.country,
        number: institution.number,
        street: institution.street,
        province: institution.province,
        email: institution.email,
        phoneNumber: institution.phone,
    };
}

/**
 * Retrieves the institution name in the specified locale, with fallback to the first available name.
 *
 * @param institution - The institution object.
 * @param locale - The desired locale code.
 *
 * @returns The institution name in the specified locale or a fallback.
 */
export function getInstitutionName(institution: Institution | undefined, locale: string): string {
    if (!institution) {
        return 'N/A';
    }

    if (institution.name[locale]) {
        return institution.name[locale];
    }

    for (const locale of SUPPORTED_LOCALES) {
        if (institution.name[locale]) {
            return institution.name[locale]!;
        }
    }

    return 'N/A';
}
