import { translationToRequest } from '../translation/helpers';
import type { Institution, InstitutionRequest } from './types';

/**
 * Converts an Institution to an InstitutionRequest for editing.
 *
 * @param institution - The institution object to convert.
 * @returns An InstitutionRequest object suitable for forms.
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
