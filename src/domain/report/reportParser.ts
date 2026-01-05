import { parseAuthorityResponse } from '@/domain/authority';
import { parseLocationResponse } from '@/domain/location';
import { parseProfileResponse } from '@/domain/profile';
import { stringToDate } from '@/utils/date';
import type { AuthorityReport, LocationReport, ProfileReport, Report } from './types';

export function parseReportResponse(data: any): Report {
    const report: Report = {
        id: data.id,
        reason: data.reason,
        createdAt: stringToDate(data.createdAt),
    };

    if (data.createdBy) {
        report.createdBy = parseProfileResponse(data.createdBy);
    }

    return report;
}

export function parseLocationReportResponse(data: any): LocationReport {
    const report: LocationReport = {
        id: data.id,
        reason: data.reason,
        createdAt: stringToDate(data.createdAt),
        location: parseLocationResponse(data.location),
    };

    if (data.createdBy) {
        report.createdBy = parseProfileResponse(data.createdBy);
    }

    return report;
}

export function parseAuthorityReportResponse(data: any): AuthorityReport {
    const report: AuthorityReport = {
        id: data.id,
        reason: data.reason,
        createdAt: stringToDate(data.createdAt),
        authority: parseAuthorityResponse(data.authority),
    };

    if (data.createdBy) {
        report.createdBy = parseProfileResponse(data.createdBy);
    }

    return report;
}

export function parseProfileReportResponse(data: any): ProfileReport {
    const report: ProfileReport = {
        id: data.id,
        reason: data.reason,
        createdAt: stringToDate(data.createdAt),
        profile: parseProfileResponse(data.profile),
    };

    if (data.createdBy) {
        report.createdBy = parseProfileResponse(data.createdBy);
    }

    return report;
}
