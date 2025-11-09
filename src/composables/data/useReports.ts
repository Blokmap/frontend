import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { toValue, type MaybeRef } from 'vue';
import { useToast } from '@/composables/store/useToast';
import {
    createLocationReport,
    deleteLocationReport,
    readLocationReports,
    readAllLocationReports,
    type Report,
    type LocationReport,
    type ReportIncludes,
} from '@/domain/report';
import { invalidateQueries } from './queryCache';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { Paginated } from '@/utils/pagination';

export type CreateLocationReportParams = {
    locationId: number;
    reason: string;
};

export function useCreateLocationReport(
    options: CompMutationOptions = {},
): CompMutation<CreateLocationReportParams, Report> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            const { locationId } = variables;
            invalidateQueries(queryClient, ['reports', 'list', 'byLocation', locationId]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Melding aangemaakt',
                    detail: 'De melding is succesvol aangemaakt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, reason }: CreateLocationReportParams) => {
            return createLocationReport(locationId, reason);
        },
    });

    return mutation;
}

export type DeleteLocationReportParams = {
    locationId: number;
    reportId: number;
};

export function useDeleteLocationReport(
    options: CompMutationOptions = {},
): CompMutation<DeleteLocationReportParams> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        onSuccess: (data, variables, context) => {
            const { locationId } = variables;
            invalidateQueries(queryClient, ['reports', 'list', 'byLocation', locationId]);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Melding verwijderd',
                    detail: 'De melding is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
        mutationFn: ({ locationId, reportId }: DeleteLocationReportParams) => {
            return deleteLocationReport(locationId, reportId);
        },
    });

    return mutation;
}

export function useReadLocationReports(
    locationId: MaybeRef<number>,
    reportIncludes: ReportIncludes[] = [],
    options: CompQueryOptions = {},
): CompQuery<Paginated<Report>> {
    const query = useQuery({
        ...options,
        queryKey: ['reports', 'list', 'byLocation', locationId],
        queryFn: () => {
            const locationIdValue = toValue(locationId);
            const includesValue = toValue(reportIncludes);
            return readLocationReports(locationIdValue, includesValue);
        },
    });

    return query;
}

export function useReadAllLocationReports(
    reportIncludes: ReportIncludes[] = [],
    options: CompQueryOptions = {},
): CompQuery<Paginated<LocationReport>> {
    const query = useQuery({
        ...options,
        queryKey: ['reports', 'list', 'byLocation'],
        queryFn: () => {
            const includesValue = toValue(reportIncludes);
            return readAllLocationReports(includesValue);
        },
    });

    return query;
}
