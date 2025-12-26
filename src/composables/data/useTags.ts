import { useMutation, useQuery } from '@tanstack/vue-query';
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
        queryKey: ['tags', 'list'],
        queryFn: readTags,
    });

    return query;
}

export function useCreateTag(options: CompMutationOptions = {}): CompMutation<TagRequest, Tag> {
    const mutation = useMutation({
        ...options,
        mutationFn: createTag,
    });

    return mutation;
}

export function useUpdateTag(
    options: CompMutationOptions = {},
): CompMutation<UpdateTagParams, Tag> {
    const mutation = useMutation({
        ...options,
        mutationFn: updateTag,
    });

    return mutation;
}

export function useDeleteTag(options: CompMutationOptions = {}): CompMutation<number, void> {
    const mutation = useMutation({
        ...options,
        mutationFn: deleteTag,
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
