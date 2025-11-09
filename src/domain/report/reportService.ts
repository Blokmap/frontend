import { client } from '@/config/axiosConfig';
import { endpoints } from '@/config/endpoints';
import { stringToDate } from '@/utils/date';
import { transformPaginatedResponseFactory, transformResponseFactory } from '@/utils/serviceUtils';
import { parseLocationResponse } from '../location';
import { parseProfileResponse } from '../profile';
import type { LocationReport, Report, ReportFilter } from './types';
import type { Paginated } from '@/utils/pagination';

export type ReportIncludes = 'createdBy';

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

export async function createLocationReport(locationId: number, reason: string): Promise<Report> {
    const endpoint = endpoints.locations.reports.create.replace('{id}', locationId.toString());

    const body = { reason };

    const transformResponse = transformResponseFactory(parseReportResponse);

    const { data } = await client.post(endpoint, body, {
        transformResponse,
    });

    return data;
}

export async function deleteLocationReport(locationId: number, reportId: number): Promise<void> {
    const endpoint = endpoints.locations.reports.delete
        .replace('{id}', locationId.toString())
        .replace('{reportId}', reportId.toString());

    await client.delete(endpoint);
}

export async function readLocationReports(
    locationId: number,
    reportIncludes?: ReportIncludes[],
): Promise<Paginated<Report>> {
    const endpoint = endpoints.locations.reports.list.replace('{id}', locationId.toString());

    const params = { reportIncludes };

    const transformResponse = transformPaginatedResponseFactory(parseReportResponse);

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
}

export async function readAllLocationReports(
    filters: ReportFilter,
    locationReportIncludes: ReportIncludes[] = [],
): Promise<Paginated<LocationReport>> {
    const endpoint = endpoints.locations.reports.all;

    const params = {
        ...filters,
        locationReportIncludes,
    };

    const transformResponse = transformPaginatedResponseFactory(parseLocationReportResponse);

    const { data } = await client.get(endpoint, {
        params,
        transformResponse,
    });

    return data;
}
