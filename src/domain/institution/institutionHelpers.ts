import { translationToBody } from '../translation/translationHelpers';
import type { Institution, InstitutionBody } from './types';

/**
 * Converts an Institution to an InstitutionBody for editing.
 *
 * @param institution - The institution object to convert.
 * @returns An InstitutionBody object suitable for forms.
 */
export function institutionToBody(institution: Institution): InstitutionBody {
    return {
        category: institution.category,
        name: translationToBody(institution.name),
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
