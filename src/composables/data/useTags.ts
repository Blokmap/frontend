import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { useToast } from '@/composables/store/useToast';
import {
    readTags,
    createTag,
    updateTag,
    deleteTag,
    setLocationTags,
    type Tag,
    type TagRequest,
    type UpdateTagParams,
    type SetLocationTagParams,
} from '@/domain/tag';
import { invalidateQueries } from './queryCache';
import type { Location } from '@/domain/location';
import type {
    CompMutation,
    CompMutationOptions,
    CompQuery,
    CompQueryOptions,
} from '@/utils/composable';
import type { AxiosError } from 'axios';

export function useReadTags(options: CompQueryOptions = {}): CompQuery<Tag[]> {
    const query = useQuery<Tag[], AxiosError>({
        ...options,
        staleTime: Infinity,
        queryKey: ['tags', 'list'],
        queryFn: readTags,
    });

    return query;
}

export function useCreateTag(options: CompMutationOptions = {}): CompMutation<TagRequest, Tag> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: createTag,
        onSuccess: (data, variables, context) => {
            // Invalidate all location queries
            invalidateQueries(queryClient, ['tags', 'list']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Tag aangemaakt',
                    detail: 'De tag is succesvol aangemaakt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

export function useUpdateTag(
    options: CompMutationOptions = {},
): CompMutation<UpdateTagParams, Tag> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: updateTag,
        onSuccess: (data, variables, context) => {
            // Invalidate all tag queries
            invalidateQueries(queryClient, ['tags']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Tag bijgewerkt',
                    detail: 'De tag is succesvol bijgewerkt.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

export function useDeleteTag(options: CompMutationOptions = {}): CompMutation<number, void> {
    const queryClient = useQueryClient();
    const toast = useToast();

    const mutation = useMutation({
        ...options,
        mutationFn: deleteTag,
        onSuccess: (data, variables, context) => {
            // Invalidate all tag queries
            invalidateQueries(queryClient, ['tags']);

            if (!options.disableToasts) {
                toast.add({
                    severity: 'success',
                    summary: 'Tag verwijderd',
                    detail: 'De tag is succesvol verwijderd.',
                });
            }

            options.onSuccess?.(data, variables, context);
        },
    });

    return mutation;
}

export function useSetLocationTags(
    options: CompMutationOptions = {},
): CompMutation<SetLocationTagParams, Location> {
    const mutation = useMutation({
        ...options,
        mutationFn: setLocationTags,
    });

    return mutation;
}
